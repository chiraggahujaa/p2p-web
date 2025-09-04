import api from './axios';
import {
  type CitiesResponse,
  type CityCoordinates,
  type CityCoordinatesResponse,
  type GetCitiesOptions
} from '../../types/cities';

export type { CitiesResponse, CityCoordinates, CityCoordinatesResponse, GetCitiesOptions };

export const citiesApi = {
  getCities: async (options?: GetCitiesOptions): Promise<CitiesResponse> => {
    // Base URL already includes /api, so endpoint is /cities
    const response = await api.get<CitiesResponse>('/api/cities', {
      params: options ?? {},
    });
    return response.data;
  },

  getCityCoordinates: async (cityName: string): Promise<CityCoordinates | null> => {
    try {
      const response = await api.get<CityCoordinatesResponse>(`/api/cities/${encodeURIComponent(cityName)}/coordinates`);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.warn(`Failed to get coordinates for city: ${cityName}`, error);
      return null;
    }
  },
};

export default citiesApi;
