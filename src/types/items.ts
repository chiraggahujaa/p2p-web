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
  locationId: string;
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
  categoryId?: string;
  locationId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  deliveryMode?: string;
  startDate?: string;
  endDate?: string;
  radius?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'distance' | 'newest' | 'popular';
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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
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