import { useQuery } from "@tanstack/react-query";
import { categoriesAPI } from "@/lib/api/categories";
import { itemsAPI } from "@/lib/api/items";

interface UseHomeDataParams {
  selectedCategory: string;
  currentPage: number;
  itemsPerPage: number;
  selectedCity: string | null;
  proximityEnabled: boolean;
  proximityRadius: number;
  userLocation: { latitude: number; longitude: number } | null;
  isHomePage: boolean;
}

export const useHomeData = ({
  selectedCategory,
  currentPage,
  itemsPerPage,
  selectedCity,
  proximityEnabled,
  proximityRadius,
  userLocation,
  isHomePage,
}: UseHomeDataParams) => {
  const { data: popularCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories", "popular"],
    queryFn: categoriesAPI.getPopular,
  });

  const { data: allCategories, isLoading: allCategoriesLoading } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: categoriesAPI.getAll,
  });

  // Only apply proximity filtering on home page when enabled and location is available
  const shouldApplyProximity = isHomePage && proximityEnabled && userLocation;

  const { data: itemsResponse, isLoading: itemsLoading } = useQuery({
    queryKey: [
      "items",
      selectedCategory,
      currentPage,
      itemsPerPage,
      selectedCity,           // Re-fetch when city changes
      proximityEnabled,       // Re-fetch when proximity toggled
      proximityRadius,        // Re-fetch when radius changes
      userLocation?.latitude, // Re-fetch when location changes
      userLocation?.longitude,
      isHomePage,            // Re-fetch when route changes
    ],
    queryFn: () => {
      const filters = {
        limit: itemsPerPage,
        page: currentPage,
        ...(selectedCategory && selectedCategory !== "other" ? { categoryId: selectedCategory } : {}),
        // Primary filter: City name
        ...(selectedCity ? { city: selectedCity } : {}),
        // Secondary filter: GPS location + radius (only on home page)
        ...(shouldApplyProximity ? {
          location: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            radius: proximityRadius
          }
        } : {}),
      };
      return itemsAPI.search(filters);
    },
    enabled: true,
  });

  return {
    popularCategories,
    categoriesLoading,
    allCategories,
    allCategoriesLoading,
    itemsResponse,
    itemsLoading,
  };
};
