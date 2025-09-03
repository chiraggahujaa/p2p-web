export interface CreateLocationDto {
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}
