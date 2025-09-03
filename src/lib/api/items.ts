import api from './axios';
import {
  type Item,
  type SearchFilters,
  type AvailabilityCheck,
  type PriceCalculation,
  type ItemsApiResponse
} from '../../types/items';

export type { Item };

import { ApiResponse, PaginatedResponse } from '@/types/api';

export const itemsAPI = {
  // Search items with filters
  search: async (filters: SearchFilters = {}): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    const queryParams = new URLSearchParams();
    
    console.log('Filters', filters); // TODO : Needs to be tested
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'location' && typeof value === 'object' && !Array.isArray(value)) {
          // Handle location object with nested properties
          const location = value as { latitude: number; longitude: number; radius?: number };
          queryParams.append('location[latitude]', location.latitude.toString());
          queryParams.append('location[longitude]', location.longitude.toString());
          if (location.radius) {
            queryParams.append('location[radius]', location.radius.toString());
          }
        } else if (key === 'priceRange' && typeof value === 'object' && !Array.isArray(value)) {
          // Handle priceRange object
          const priceRange = value as { min?: number; max?: number };
          if (priceRange.min !== undefined) {
            queryParams.append('priceRange[min]', priceRange.min.toString());
          }
          if (priceRange.max !== undefined) {
            queryParams.append('priceRange[max]', priceRange.max.toString());
          }
        } else if (key === 'availability' && typeof value === 'object' && !Array.isArray(value)) {
          // Handle availability object
          const availability = value as { startDate?: string; endDate?: string };
          if (availability.startDate) {
            queryParams.append('availability[startDate]', availability.startDate);
          }
          if (availability.endDate) {
            queryParams.append('availability[endDate]', availability.endDate);
          }
        } else if (Array.isArray(value)) {
          // Handle arrays by appending each value
          value.forEach(v => queryParams.append(key, v.toString()));
        } else {
          // Handle primitive values
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await api.get(`/api/items/search?${queryParams.toString()}`);
    const apiResponse: ItemsApiResponse = response.data;
    
    return {
      success: apiResponse.success,
      message: 'Items retrieved successfully',
      data: {
        data: apiResponse.data,
        pagination: apiResponse.pagination
      }
    };
  },


  // Get popular items
  getPopular: async (limit: number = 10): Promise<ApiResponse<Item[]>> => {
    const response = await api.get(`/api/items/popular?limit=${limit}`);
    const apiResponse = response.data;
    return {
      success: apiResponse.success,
      message: apiResponse.message || 'Popular items retrieved successfully',
      data: apiResponse.data
    };
  },

  // Get featured items
  getFeatured: async (limit: number = 10): Promise<ApiResponse<Item[]>> => {
    const response = await api.get(`/api/items/featured?limit=${limit}`);
    const apiResponse = response.data;
    return {
      success: apiResponse.success,
      message: apiResponse.message || 'Featured items retrieved successfully',
      data: apiResponse.data
    };
  },

  // Get item by ID
  getById: async (id: string): Promise<ApiResponse<Item>> => {
    const response = await api.get(`/api/items/${id}`);
    const apiResponse = response.data;
    return {
      success: apiResponse.success,
      message: apiResponse.message || 'Item retrieved successfully',
      data: apiResponse.data
    };
  },

  // Get similar items
  getSimilar: async (id: string, limit: number = 6): Promise<ApiResponse<Item[]>> => {
    const response = await api.get(`/api/items/${id}/similar?limit=${limit}`);
    const apiResponse = response.data;
    return {
      success: apiResponse.success,
      message: apiResponse.message || 'Similar items retrieved successfully',
      data: apiResponse.data
    };
  },

  // Check availability
  checkAvailability: async (id: string, dates: AvailabilityCheck): Promise<ApiResponse<{ available: boolean; conflicts?: unknown[] }>> => {
    const response = await api.post(`/api/items/${id}/availability`, dates);
    return response.data;
  },

  // Calculate pricing for date range
  calculatePrice: (item: Item, startDate: string, endDate: string): PriceCalculation => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const basePrice = item.rentPricePerDay * totalDays;
    let discountPercentage = 0;
    let discountAmount = 0;

    // Apply discounts for longer rentals
    if (totalDays >= 30) {
      discountPercentage = 15; // 15% off for monthly rentals
    } else if (totalDays >= 7) {
      discountPercentage = 10; // 10% off for weekly rentals
    }

    if (discountPercentage > 0) {
      discountAmount = basePrice * (discountPercentage / 100);
    }

    const finalPrice = basePrice - discountAmount;

    return {
      startDate,
      endDate,
      rentPricePerDay: item.rentPricePerDay,
      totalDays,
      totalPrice: basePrice,
      discountPercentage,
      discountAmount,
      finalPrice,
    };
  },

  // Get items by category
  getByCategory: async (categoryId: string, limit: number = 20, page: number = 1): Promise<ApiResponse<PaginatedResponse<Item>>> => {
    return itemsAPI.search({ categoryId, limit, page });
  },

  // Create new item
  create: async (data: CreateItemDto): Promise<ApiResponse<Item>> => {
    const response = await api.post('/api/items', data);
    return response.data;
  },

  // Update existing item
  update: async (id: string, data: UpdateItemDto): Promise<ApiResponse<Item>> => {
    const response = await api.put(`/api/items/${id}`, data);
    return response.data;
  },

  // Delete item
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/api/items/${id}`);
    return response.data;
  },
};

// DTOs for creating and updating items
export interface CreateItemDto {
  title: string;
  description?: string;
  categoryId: string;
  condition: 'new' | 'likeNew' | 'good' | 'fair' | 'poor';
  securityAmount?: number;
  rentPricePerDay: number;
  addressData?: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  deliveryMode?: 'none' | 'pickup' | 'delivery' | 'both';
  minRentalDays?: number;
  maxRentalDays?: number;
  isNegotiable?: boolean;
  tags?: string[];
  imageUrls?: string[];
}

export interface UpdateItemDto {
  title?: string;
  description?: string;
  categoryId?: string;
  condition?: 'new' | 'likeNew' | 'good' | 'fair' | 'poor';
  securityAmount?: number;
  rentPricePerDay?: number;
  addressData?: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  deliveryMode?: 'none' | 'pickup' | 'delivery' | 'both';
  minRentalDays?: number;
  maxRentalDays?: number;
  isNegotiable?: boolean;
  tags?: string[];
  status?: 'available' | 'booked' | 'in_transit' | 'unavailable';
  imageUrls?: string[];
}

// File upload related interfaces
export interface UploadedFile {
  id: string;
  userId: string;
  name: string;
  originalName: string;
  url: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  isPublic: boolean;
  bucket: string;
  path: string;
  uploadedOn: string;
  altText?: string | null;
}

// File upload API
export const filesAPI = {
  // Upload product images
  uploadProductImages: async (files: File[]): Promise<ApiResponse<UploadedFile[]>> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('bucket', 'images');
    formData.append('isPublic', 'true');

    const response = await api.post('/api/files/upload/product-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete file
  deleteFile: async (fileId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/api/files/${fileId}`);
    return response.data;
  },

  // Get user files
  getUserFiles: async (fileType?: string): Promise<ApiResponse<UploadedFile[]>> => {
    const params = fileType ? { fileType } : {};
    const response = await api.get('/api/files/my-files', { params });
    return response.data;
  },
};