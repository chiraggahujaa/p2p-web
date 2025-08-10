import api from './axios';

export interface CitiesResponse {
  cities: string[];
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
};

export default citiesApi;
