import { CreateLocationDto } from './location';

export interface Location {
  id?: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserLocation {
  id: string;
  userId: string;
  locationId: string;
  isDefault: boolean;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserLocationWithDetails extends UserLocation {
  location: Location;
}

export interface DefaultLocationResponse {
  locationId: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  label: string;
}

export interface CreateUserLocationDto {
  locationId: string;
  isDefault?: boolean;
  label?: string;
}

export interface UpdateUserLocationDto {
  location?: CreateLocationDto;
  isDefault?: boolean;
  label?: string;
}

export interface CreateAndAddLocationDto {
  location: CreateLocationDto;
  label?: string;
  isDefault?: boolean;
}