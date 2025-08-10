import api from './axios';
import { ApiResponse } from '@/types/api';
import { MeProfile, PublicUserProfile, UpdateMeProfilePayload } from '@/types/users-api';

export const usersAPI = {
  getPublicProfile: async (id: string): Promise<ApiResponse<PublicUserProfile>> => {
    const res = await api.get(`/api/users/${id}`);
    return res.data;
  },
  getMeProfile: async (): Promise<ApiResponse<MeProfile>> => {
    const res = await api.get('/api/users/me/profile');
    return res.data;
  },
  updateMeProfile: async (payload: UpdateMeProfilePayload): Promise<ApiResponse<unknown>> => {
    const res = await api.put('/api/users/me/profile', payload);
    return res.data;
  },
};

export default usersAPI;


