import { ApiResponse, PaginatedResponse } from './@types';
import { Item, SearchFilters, AvailabilityCheck, PriceCalculation } from './@types';
import { PublicUserProfile, MeProfile, UpdateMeProfilePayload } from './@types';
import { LoginRequest, RegisterRequest, ResetPasswordRequest, UpdatePasswordRequest, VerifyEmailRequest, PhoneLoginRequest, PhoneOtpVerificationRequest, AuthUser, AuthSession } from './auth';

// Items API Functions
export const itemsApi = {
  // Get all items with pagination and filters
  async getItems(filters: SearchFilters = {}): Promise<PaginatedResponse<Item>> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`/api/items?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    return response.json();
  },

  // Get item by ID
  async getItem(id: string): Promise<Item> {
    const response = await fetch(`/api/items/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch item');
    }
    return response.json();
  },

  // Create new item
  async createItem(itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      throw new Error('Failed to create item');
    }
    return response.json();
  },

  // Update item
  async updateItem(id: string, itemData: Partial<Item>): Promise<Item> {
    const response = await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      throw new Error('Failed to update item');
    }
    return response.json();
  },

  // Delete item
  async deleteItem(id: string): Promise<void> {
    const response = await fetch(`/api/items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
  },

  // Check item availability
  async checkAvailability(id: string, dates: AvailabilityCheck): Promise<boolean> {
    const response = await fetch(`/api/items/${id}/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dates),
    });
    if (!response.ok) {
      throw new Error('Failed to check availability');
    }
    const result = await response.json();
    return result.available;
  },

  // Calculate price
  async calculatePrice(id: string, dates: Omit<PriceCalculation, 'totalPrice' | 'discountPercentage' | 'discountAmount' | 'finalPrice'>): Promise<PriceCalculation> {
    const response = await fetch(`/api/items/${id}/price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dates),
    });
    if (!response.ok) {
      throw new Error('Failed to calculate price');
    }
    return response.json();
  },

  // Search items
  async searchItems(query: string, filters: Omit<SearchFilters, 'q'> = {}): Promise<PaginatedResponse<Item>> {
    return this.getItems({ q: query, ...filters });
  }
};

// Users API Functions
export const usersApi = {
  // Get public user profile
  async getPublicProfile(userId: string): Promise<PublicUserProfile> {
    const response = await fetch(`/api/users/${userId}/profile`);
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return response.json();
  },

  // Get current user profile
  async getMeProfile(): Promise<MeProfile> {
    const response = await fetch('/api/users/me');
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return response.json();
  },

  // Update current user profile
  async updateMeProfile(profileData: UpdateMeProfilePayload): Promise<MeProfile> {
    const response = await fetch('/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    return response.json();
  },

  // Get user's items
  async getUserItems(userId: string, page = 1, limit = 10): Promise<PaginatedResponse<Item>> {
    const response = await fetch(`/api/users/${userId}/items?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user items');
    }
    return response.json();
  }
};

// Auth API Functions
export const authApi = {
  // Login
  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: AuthUser; session: AuthSession }>> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  },

  // Register
  async register(userData: RegisterRequest): Promise<ApiResponse<{ user: AuthUser; session: AuthSession }>> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    return response.json();
  },

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Password reset failed');
    }
    return response.json();
  },

  // Update password
  async updatePassword(data: UpdatePasswordRequest): Promise<ApiResponse<void>> {
    const response = await fetch('/api/auth/update-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Password update failed');
    }
    return response.json();
  },

  // Verify email
  async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse<void>> {
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Email verification failed');
    }
    return response.json();
  },

  // Phone login
  async phoneLogin(data: PhoneLoginRequest): Promise<ApiResponse<{ phone: string; expiresIn: number }>> {
    const response = await fetch('/api/auth/phone-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Phone login failed');
    }
    return response.json();
  },

  // Phone OTP verification
  async phoneOtpVerification(data: PhoneOtpVerificationRequest): Promise<ApiResponse<{ user: AuthUser; session: AuthSession }>> {
    const response = await fetch('/api/auth/phone-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('OTP verification failed');
    }
    return response.json();
  },

  // Logout
  async logout(): Promise<void> {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Logout failed');
    }
  }
};

