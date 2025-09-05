import { z } from "zod";

// Location schema
const locationSchema = z.object({
  addressLine: z.string().min(1, "Address line is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
  country: z.string().default("India"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Product condition enum
const productConditionSchema = z.enum(["new", "likeNew", "good", "fair", "poor"], {
  message: "Please select a valid condition",
});

// Delivery mode enum
const deliveryModeSchema = z.enum(["none", "pickup", "delivery", "both"], {
  message: "Please select a valid delivery mode",
});

// Product status enum (for edit mode)
const productStatusSchema = z.enum(["available", "booked", "in_transit", "unavailable"], {
  message: "Please select a valid status",
});

// Base form fields (without refinements)
const baseProductFormSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .min(0, "")
    .default(""),
  
  categoryId: z
    .string()
    .min(1, "Please select a category"),
  
  condition: productConditionSchema,
  
  rentPricePerDay: z
    .number()
    .min(1, "Daily rent price must be at least ₹1")
    .max(100000, "Daily rent price must be less than ₹1,00,000"),
  
  securityAmount: z
    .number()
    .min(0, "Security amount cannot be negative")
    .max(1000000, "Security amount must be less than ₹10,00,000")
    .default(0),
  
  deliveryMode: deliveryModeSchema,
  
  minRentalDays: z
    .number()
    .min(1, "Minimum rental days must be at least 1")
    .max(365, "Minimum rental days must be less than 365"),
  
  maxRentalDays: z
    .number()
    .min(1, "Maximum rental days must be at least 1")
    .max(365, "Maximum rental days must be less than 365"),
  
  isNegotiable: z.boolean().default(false),
  
  tags: z
    .array(z.string().trim().min(1, "Tag cannot be empty"))
    .max(10, "Maximum 10 tags allowed")
    .default([]),
  
  location: locationSchema.nullable(),
});

// Single unified form schema with optional status
export const productFormSchema = baseProductFormSchema.extend({
  status: productStatusSchema.optional(),
}).refine(
  (data) => data.maxRentalDays >= data.minRentalDays,
  {
    message: "Maximum rental days must be greater than or equal to minimum rental days",
    path: ["maxRentalDays"],
  }
).refine(
  (data) => data.location !== null,
  {
    message: "Location is required",
    path: ["location"],
  }
);

// Use the same schema for both create and edit
export const createProductFormSchema = productFormSchema;
export const editProductFormSchema = productFormSchema;

// Infer types from schemas
export type ProductFormData = z.infer<typeof productFormSchema>;
export type CreateProductFormData = z.infer<typeof createProductFormSchema>;
export type EditProductFormData = z.infer<typeof editProductFormSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;

// Export individual schemas for reuse
export {
  locationSchema,
  productConditionSchema,
  deliveryModeSchema,
  productStatusSchema,
};