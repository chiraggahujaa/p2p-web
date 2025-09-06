import { z } from 'zod';

export const userDetailsSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().min(1, 'Phone number is required').regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  gender: z.string().min(1, 'Please select your gender'),
  dob: z.string().min(1, 'Date of birth is required'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
});

export type UserDetailsFormData = z.infer<typeof userDetailsSchema>;