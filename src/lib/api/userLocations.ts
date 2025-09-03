import api from './axios';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { 
  UserLocationWithDetails, 
  CreateUserLocationDto, 
  UpdateUserLocationDto,
  CreateAndAddLocationDto 
} from '@/types/userLocation';

export const userLocationsAPI = {
  // Get all user locations with pagination
  getUserLocations: async (page: number = 1, limit: number = 20): Promise<PaginatedResponse<UserLocationWithDetails>> => {
    const res = await api.get(`/api/users/me/locations?page=${page}&limit=${limit}`);
    return res.data;
  },


  // Add existing location to user's address book
  addLocationToUser: async (data: CreateUserLocationDto): Promise<ApiResponse<UserLocationWithDetails>> => {
    const res = await api.post('/api/users/me/locations', data);
    return res.data;
  },

  // Create new location and add to address book
  createAndAddLocation: async (data: CreateAndAddLocationDto): Promise<ApiResponse<UserLocationWithDetails>> => {
    const res = await api.post('/api/users/me/locations/create-and-add', data);
    return res.data;
  },

  // Update user location (label, default status)
  updateUserLocation: async (
    userLocationId: string, 
    data: UpdateUserLocationDto
  ): Promise<ApiResponse<UserLocationWithDetails>> => {
    const res = await api.put(`/api/users/me/locations/${userLocationId}`, data);
    return res.data;
  },

  // Remove location from user's address book
  removeUserLocation: async (userLocationId: string): Promise<ApiResponse<{ message: string }>> => {
    const res = await api.delete(`/api/users/me/locations/${userLocationId}`);
    return res.data;
  },
};

export default userLocationsAPI;