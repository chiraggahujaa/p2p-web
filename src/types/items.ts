// No longer need ApiItem import since backend returns camelCase directly


export interface Item {
  id: string;
  userId: string;
  title: string;
  description?: string;
  categoryId: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  status: 'available' | 'booked' | 'in_transit' | 'unavailable';
  securityAmount?: number;
  rentPricePerDay: number;
  locationId?: string;
  deliveryMode: 'pickup' | 'delivery' | 'both';
  minRentalDays: number;
  maxRentalDays: number;
  isNegotiable: boolean;
  tags?: string[];
  ratingAverage: number;
  ratingCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations
  owner?: {
    fullName: string;
    avatarUrl?: string;
    trustScore: number;
  };
  category?: {
    categoryName: string;
  };
  location?: {
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  };
  images?: {
    file: {
      url: string;
    };
    isPrimary: boolean;
    displayOrder: number;
  }[];
}

export interface SearchFilters {
  q?: string;
  searchTerm?: string;
  categoryId?: string;
  city?: string;
  locationId?: string;
  minPrice?: number;
  maxPrice?: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
  condition?: string[];
  deliveryMode?: string | string[];
  startDate?: string;
  endDate?: string;
  availability?: {
    startDate?: string;
    endDate?: string;
  };
  radius?: number;
  location?: {
    latitude: number;
    longitude: number;
    radius?: number;
  };
  sortBy?: 'price_asc' | 'price_desc' | 'priceAsc' | 'priceDesc' | 'rating' | 'distance' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface AvailabilityCheck {
  startDate: string;
  endDate: string;
}

export interface PriceCalculation {
  startDate: string;
  endDate: string;
  rentPricePerDay: number;
  totalDays: number;
  totalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;
}

export interface ItemsApiResponse {
  success: boolean;
  data: Item[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// DTOs for creating and updating items
export interface CreateItemDto {
  title: string;
  description?: string;
  categoryId: string;
  condition: 'new' | 'likeNew' | 'good' | 'fair' | 'poor';
  securityAmount?: number;
  rentPricePerDay: number;
  addressData?: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  deliveryMode?: 'none' | 'pickup' | 'delivery' | 'both';
  minRentalDays?: number;
  maxRentalDays?: number;
  isNegotiable?: boolean;
  tags?: string[];
  imageUrls?: string[];
}

export interface UpdateItemDto {
  title?: string;
  description?: string;
  categoryId?: string;
  condition?: 'new' | 'likeNew' | 'good' | 'fair' | 'poor';
  securityAmount?: number;
  rentPricePerDay?: number;
  addressData?: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  deliveryMode?: 'none' | 'pickup' | 'delivery' | 'both';
  minRentalDays?: number;
  maxRentalDays?: number;
  isNegotiable?: boolean;
  tags?: string[];
  status?: 'available' | 'booked' | 'in_transit' | 'unavailable';
  imageUrls?: string[];
}

// File upload related interfaces
export interface UploadedFile {
  id: string;
  userId: string;
  name: string;
  originalName: string;
  url: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  isPublic: boolean;
  bucket: string;
  path: string;
  uploadedOn: string;
  altText?: string | null;
}