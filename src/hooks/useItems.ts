"use client";

import { useQuery } from '@tanstack/react-query';
import { itemsAPI } from '@/lib/api/items';
import { useAppStore } from '@/stores/useAppStore';
import { useBrowserLocation } from './useBrowserLocation';
import { citiesApi } from '@/lib/api/cities';
import type { SearchFilters } from '@/types/items';

// Hook to search items with 3-tier location priority: browser location -> city -> no filter
export function useItemsSearch(filters: SearchFilters = {}) {
  const proximityEnabled = useAppStore((s) => s.proximityEnabled);
  const proximityRadius = useAppStore((s) => s.proximityRadius);
  const selectedCity = useAppStore((s) => s.selectedCity);
  
  // Get browser location
  const { latitude, longitude, hasLocation } = useBrowserLocation();

  return useQuery({
    queryKey: [
      'items', 
      'search', 
      filters, 
      { proximityEnabled, proximityRadius, selectedCity, hasLocation, latitude, longitude }
    ],
    queryFn: async () => {
      let searchFilters = { ...filters };
      
      // Priority 1: Use browser location if available and proximity is enabled
      if (proximityEnabled && hasLocation && latitude && longitude) {
        searchFilters = {
          ...searchFilters,
          location: {
            latitude,
            longitude,
            radius: proximityRadius
          }
        };
      }
      // Priority 2: Use selected city coordinates if browser location not available
      else if (proximityEnabled && selectedCity && !hasLocation) {
        try {
          const cityCoords = await citiesApi.getCityCoordinates(selectedCity);
          if (cityCoords) {
            searchFilters = {
              ...searchFilters,
              location: {
                latitude: cityCoords.latitude,
                longitude: cityCoords.longitude,
                radius: proximityRadius
              }
            };
          }
        } catch (error) {
          console.warn('Failed to get city coordinates for search:', error);
        }
      }
      // Priority 3: No location filter (default behavior)
      const result = await itemsAPI.search(searchFilters);
      return result.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook for popular items
export function usePopularItems(limit: number = 10) {
  return useQuery({
    queryKey: ['items', 'popular', limit],
    queryFn: async () => {
      const result = await itemsAPI.getPopular(limit);
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook for featured items
export function useFeaturedItems(limit: number = 10) {
  return useQuery({
    queryKey: ['items', 'featured', limit],
    queryFn: async () => {
      const result = await itemsAPI.getFeatured(limit);
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook for item details
export function useItemDetails(id: string) {
  return useQuery({
    queryKey: ['items', 'details', id],
    queryFn: async () => {
      const result = await itemsAPI.getById(id);
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
}

// Hook for similar items
export function useSimilarItems(id: string, limit: number = 6) {
  return useQuery({
    queryKey: ['items', 'similar', id, limit],
    queryFn: async () => {
      const result = await itemsAPI.getSimilar(id, limit);
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id,
  });
}

// Hook for items by category with 3-tier location priority
export function useItemsByCategory(categoryId: string, options: { limit?: number; page?: number } = {}) {
  const proximityEnabled = useAppStore((s) => s.proximityEnabled);
  const proximityRadius = useAppStore((s) => s.proximityRadius);
  const selectedCity = useAppStore((s) => s.selectedCity);
  const { limit = 20, page = 1 } = options;
  
  // Get browser location
  const { latitude, longitude, hasLocation } = useBrowserLocation();

  return useQuery({
    queryKey: [
      'items', 
      'category', 
      categoryId, 
      { limit, page, proximityEnabled, proximityRadius, selectedCity, hasLocation, latitude, longitude }
    ],
    queryFn: async () => {
      let searchFilters: SearchFilters = {
        categoryId,
        limit,
        page
      };
      
      // Priority 1: Use browser location if available and proximity is enabled
      if (proximityEnabled && hasLocation && latitude && longitude) {
        searchFilters = {
          ...searchFilters,
          location: {
            latitude,
            longitude,
            radius: proximityRadius
          }
        };
      }
      // Priority 2: Use selected city coordinates if browser location not available
      else if (proximityEnabled && selectedCity && !hasLocation) {
        try {
          const cityCoords = await citiesApi.getCityCoordinates(selectedCity);
          if (cityCoords) {
            searchFilters = {
              ...searchFilters,
              location: {
                latitude: cityCoords.latitude,
                longitude: cityCoords.longitude,
                radius: proximityRadius
              }
            };
          }
        } catch (error) {
          console.warn('Failed to get city coordinates for category search:', error);
        }
      }
      // Priority 3: No location filter (default behavior)
      
      const result = await itemsAPI.search(searchFilters);
      return result.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!categoryId,
  });
}