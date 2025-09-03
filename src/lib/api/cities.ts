import api from './axios';

export interface CitiesResponse {
  cities: string[];
}

export interface CityCoordinates {
  name: string;
  latitude: number;
  longitude: number;
}

export interface CityCoordinatesResponse {
  success: boolean;
  data: CityCoordinates;
}

type GetCitiesOptions = {
  lat?: number;
  lon?: number;
  prefer?: string; // optional city name hint
};

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
