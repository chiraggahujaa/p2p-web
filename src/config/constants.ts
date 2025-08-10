export const APP_CONFIG = {
  name: 'P2P Rent',
  description: 'Peer-to-peer item rental platform',
  version: '1.0.0',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
} as const;

export const AUTH_CONFIG = {
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
} as const;

export const RENTAL_PERIODS = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
} as const;

export const PRODUCT_CONDITIONS = {
  NEW: 'new',
  LIKE_NEW: 'like_new',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
} as const;

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
} as const;

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;

export const USER_STATUSES = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
  PENDING_VERIFICATION: 'pending_verification',
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export const FILE_UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFiles: 10,
} as const;

export const PAGINATION_CONFIG = {
  defaultPageSize: 12,
  maxPageSize: 100,
  pageSizeOptions: [12, 24, 48, 96],
} as const;

export const SEARCH_CONFIG = {
  minQueryLength: 2,
  maxResults: 50,
  debounceDelay: 300, // milliseconds
} as const;

export const MAP_CONFIG = {
  defaultZoom: 12,
  maxZoom: 18,
  minZoom: 8,
  defaultCenter: {
    lat: 40.7128,
    lng: -74.0060,
  },
} as const;

export const CURRENCY_CONFIG = {
  default: 'USD',
  supported: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
  symbols: {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
  },
} as const;

export const TIMEZONE_CONFIG = {
  default: 'UTC',
  supported: [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney',
  ],
} as const;

export const RATING_CONFIG = {
  min: 1,
  max: 5,
  step: 0.5,
} as const;

export const SECURITY_CONFIG = {
  passwordMinLength: 8,
  passwordRequirements: {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  },
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
} as const;
