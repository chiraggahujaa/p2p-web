import { z } from 'zod';
import { changePasswordSchema, resetPasswordSchema } from '../validation/security';

// Form data types
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
