import api from './axios';
import {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  VerifyEmailRequest,
  PhoneLoginRequest,
  PhoneOtpVerificationRequest,
  AuthResponse,
  ProfileResponse,
  SendOtpResponse,
  AuthUser,
} from '../../types/auth';

// Helper: normalize backend user (raw Supabase user or already-normalized) to AuthUser
const mapToAuthUser = (input: unknown): AuthUser | null => {
  if (!input) return null;
  if (typeof input === 'object' && input !== null) {
    const obj = input as Record<string, unknown>;
    // Already normalized shape
    if ('id' in obj && 'email' in obj && 'createdAt' in obj && 'updatedAt' in obj) {
      return {
        id: String(obj.id),
        email: (obj.email as string) ?? '',
        name: (obj.name as string | null) ?? null,
        emailConfirmedAt: (obj.emailConfirmedAt as string | null) ?? null,
        createdAt: String(obj.createdAt),
        updatedAt: String(obj.updatedAt),
      };
    }
    // Raw Supabase user
    const meta = (obj.user_metadata as Record<string, unknown> | undefined) || {};
    const nameFromMeta = (meta.full_name as string | undefined) || (meta.name as string | undefined) || null;
    return {
      id: String(obj.id as string),
      email: (obj.email as string) ?? '',
      name: nameFromMeta ?? null,
      emailConfirmedAt: (obj.email_confirmed_at as string | null) ?? null,
      createdAt: String(obj.created_at as string),
      updatedAt: String((obj.updated_at as string) ?? (obj.created_at as string)),
    };
  }
  return null;
};

export const authAPI = {
  // Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post('/api/auth/login', data);
    const backend = res.data;
    const user = mapToAuthUser(backend?.data?.user);
    const session = (backend?.data?.session || null) as Record<string, unknown> | null;
    return { success: !!backend?.success, data: { user, session }, message: backend?.message };
  },

  // Register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post('/api/auth/register', data);
    const backend = res.data;
    const user = mapToAuthUser(backend?.data?.user);
    const session = (backend?.data?.session || null) as Record<string, unknown> | null;
    return { success: !!backend?.success, data: { user, session }, message: backend?.message };
  },

  // Logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.post('/api/auth/logout');
      return { success: !!res.data?.success, message: res.data?.message || 'Logged out successfully' };
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      return { success: false, message: err?.response?.data?.error || 'Logout failed' };
    }
  },

  // Get user profile
  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const res = await api.get('/api/auth/profile');
      const backend = res.data;
      if (!backend?.success) return { success: false, data: { user: null, profile: null } };
      const user = mapToAuthUser(backend?.data?.user);
      const profile = backend?.data?.profile ?? null;
      return { success: true, data: { user, profile } };
    } catch (_) {
      return { success: false, data: { user: null, profile: null } };
    }
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token')
        : null;
    if (!refreshToken) {
      return { success: false, data: { user: null, session: null }, message: 'No refresh token' };
    }
    const res = await api.post('/api/auth/refresh', { refreshToken });
    const backend = res.data;
    const user = mapToAuthUser(backend?.data?.user);
    const session = (backend?.data?.session || null) as Record<string, unknown> | null;
    if (!backend?.success || !session || !user) {
      return { success: false, data: { user: null, session: null }, message: 'Unable to refresh session' };
    }
    return { success: true, data: { user, session }, message: 'Session refreshed' };
  },

  // Verify email
  verifyEmail: async (data: VerifyEmailRequest): Promise<AuthResponse> => {
    const res = await api.post('/api/auth/verify', data);
    const backend = res.data;
    const user = mapToAuthUser(backend?.data?.user);
    const session = (backend?.data?.session || null) as Record<string, unknown> | null;
    return { success: !!backend?.success, data: { user, session }, message: backend?.message || 'Email verified' };
  },

  // Request password reset
  resetPassword: async (data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> => {
    const res = await api.post('/api/auth/reset-password', { email: data.email });
    const backend = res.data;
    return { success: !!backend?.success, message: backend?.message || (backend?.success ? 'Password reset email sent' : 'Failed to request password reset') };
  },

  // Update password
  updatePassword: async (data: UpdatePasswordRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.put('/api/auth/password', { password: data.password, currentPassword: data.currentPassword });
      return { success: !!res.data?.success, message: res.data?.message || 'Password updated' };
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      return { success: false, message: err?.response?.data?.error || 'Failed to update password' };
    }
  },

  // Send phone OTP
  sendPhoneOtp: async (data: PhoneLoginRequest): Promise<SendOtpResponse> => {
    const res = await api.post('/api/auth/phone/send-otp', { phone: data.phone });
    const backend = res.data;
    return {
      success: !!backend?.success,
      message: backend?.message || 'OTP sent',
      data: { phone: data.phone, expiresIn: 60 },
    };
  },

  // Verify phone OTP
  verifyPhoneOtp: async (data: PhoneOtpVerificationRequest): Promise<AuthResponse> => {
    const res = await api.post('/api/auth/phone/verify-otp', { phone: data.phone, otp: data.otp });
    const backend = res.data;
    const user = mapToAuthUser(backend?.data?.user);
    const session = (backend?.data?.session || null) as Record<string, unknown> | null;
    return { success: !!backend?.success, data: { user, session }, message: backend?.message || 'Phone verified and signed in' };
  },

  // Google Sign-In
  googleSignIn: async (tokens: { accessToken: string; idToken: string }): Promise<AuthResponse> => {
    const res = await api.post('/api/auth/google/signin', {
      accessToken: tokens.accessToken,
      idToken: tokens.idToken,
    });
    const backend = res.data;
    const user = mapToAuthUser(backend?.data?.user);
    const session = (backend?.data?.session || null) as Record<string, unknown> | null;
    return { success: !!backend?.success, data: { user, session }, message: backend?.message || 'Google sign-in successful' };
  },

  // Google Sign-Up
  googleSignUp: async (tokens: { accessToken: string; idToken: string }): Promise<AuthResponse> => {
    const res = await api.post('/api/auth/google/signup', {
      accessToken: tokens.accessToken,
      idToken: tokens.idToken,
    });
    const backend = res.data;
    const user = mapToAuthUser(backend?.data?.user);
    const session = (backend?.data?.session || null) as Record<string, unknown> | null;
    return { success: !!backend?.success, data: { user, session }, message: backend?.message || 'Google sign-up successful' };
  },
};

export default authAPI;
