import api from './axios';
import { ApiResponse } from '@/types/api';
import { type Category } from '../../types/categories';

export type { Category };

export const categoriesAPI = {
  // Get all categories
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/api/categories');
    return response.data;
  },

  // Get hierarchical categories
  getHierarchical: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/api/categories?hierarchical=true');
    return response.data;
  },

  // Get popular categories
  getPopular: async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get('/api/categories/popular');
    return response.data;
  },

  // Get category by ID
  getById: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  // Search categories
  search: async (query: string): Promise<ApiResponse<Category[]>> => {
    const response = await api.get(`/api/categories/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get subcategories
  getSubcategories: async (parentId: string): Promise<ApiResponse<Category[]>> => {
    const response = await api.get(`/api/categories/${parentId}/subcategories`);
    return response.data;
  },

  // Get category hierarchy (breadcrumb)
  getHierarchy: async (id: string): Promise<ApiResponse<Category[]>> => {
    const response = await api.get(`/api/categories/${id}/hierarchy`);
    return response.data;
  },
};