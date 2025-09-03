import { z } from 'zod';

// Base location schema for address details
export const locationSchema = z.object({
  addressLine: z.string()
    .min(1, 'Address line is required')
    .max(255, 'Address line must be less than 255 characters'),
  city: z.string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters'),
  state: z.string()
    .min(1, 'State is required')
    .max(100, 'State must be less than 100 characters'),
  pincode: z.string()
    .min(1, 'Pincode is required')
    .regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  country: z.string().optional(),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
});

// Enhanced location schema with better validation for creation
export const createLocationSchema = z.object({
  addressLine: z.string()
    .min(5, 'Address line must be at least 5 characters')
    .max(255, 'Address line must be less than 255 characters'),
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters'),
  state: z.string()
    .min(2, 'State must be at least 2 characters')
    .max(100, 'State must be less than 100 characters'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  country: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
}).refine(
  (data) => data.addressLine && data.city && data.state && data.pincode,
  { message: 'All required location fields must be filled' }
);

// Label validation
export const labelSchema = z.string()
  .min(1, 'Label is required')
  .max(50, 'Label must be less than 50 characters');

// Edit location form schema
export const editLocationSchema = z.object({
  location: locationSchema,
  label: labelSchema,
  isDefault: z.boolean(),
});

// Add existing location form schema
export const addLocationSchema = z.object({
  locationId: z.string().uuid('Please select a valid location'),
  label: labelSchema,
  isDefault: z.boolean(),
});

// Create and add location form schema
export const createAndAddLocationSchema = z.object({
  location: createLocationSchema,
  label: labelSchema,
  isDefault: z.boolean(),
});

// Types
export type LocationFormData = z.infer<typeof locationSchema>;
export type CreateLocationFormData = z.infer<typeof createLocationSchema>;
export type EditLocationFormData = z.infer<typeof editLocationSchema>;
export type AddLocationFormData = z.infer<typeof addLocationSchema>;
export type CreateAndAddLocationFormData = z.infer<typeof createAndAddLocationSchema>;