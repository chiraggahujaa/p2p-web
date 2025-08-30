export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicUserProfile {
  userId: string;
  fullName: string | null;
  avatarUrl?: string | null;
  trustScore: number;
  isVerified: boolean;
  bio?: string | null;
  location?: { city?: string | null; state?: string | null } | null;
  createdAt: string;
}

export interface MeProfile {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  gender?: string | null;
  dob?: string | null;
  dob_visibility?: 'private' | 'friends' | 'public' | null;
  trust_score?: number | null;
  is_verified?: boolean | null;
  avatar_url?: string | null;
  bio?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  location?: { city?: string | null; state?: string | null } | null;
}

export interface UpdateMeProfilePayload {
  fullName?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  dobVisibility?: 'private' | 'friends' | 'public';
  bio?: string;
  avatarUrl?: string;
}

