# Claude Code Configuration

## Git Commit Guidelines

When creating git commits, do not include:
- Claude watermark ("🤖 Generated with [Claude Code](https://claude.ai/code)")
- Co-authored by Claude attribution ("Co-Authored-By: Claude <noreply@anthropic.com>")

Keep commit messages clean and professional without AI attribution.

## Styling Guidelines

### UI Framework & Styling
- **Primary**: Use shadcn/ui components for all UI elements
- **Styling**: Use Tailwind CSS for custom styling and responsive design
- **Icons**: Use Lucide React icons for consistent iconography
- **Components**: Prefer shadcn/ui components over custom implementations

### Global Preferences

#### Tech Stack
- **Frontend**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand for global state
- **Forms**: React Hook Form with validation
- **API**: React Query (TanStack Query) for data fetching
- **Authentication**: Custom auth system with hooks

#### Code Patterns
- **Components**: Function components with TypeScript
- **Styling**: Use `cn()` utility for conditional classes
- **Responsive**: Mobile-first design approach
- **Loading States**: Use shadcn/ui LoadingSpinner component
- **Error Handling**: Toast notifications using sonner
- **File Structure**: Feature-based organization under `/app/(private)` and `/app/(public)`

#### UI/UX Standards
- **Cards**: Use shadcn/ui Card components for content sections
- **Buttons**: Consistent button variants (primary, secondary, destructive, outline)
- **Forms**: Proper validation feedback and error states
- **Modals**: Use Dialog component for overlays and previews
- **Feedback**: Toast notifications for user actions
- **Navigation**: Clean breadcrumb and back navigation patterns

#### File Organization Standards
- **Utilities**: Avoid creating unnecessary `index.ts` files just to re-export functions from a single file
  - ✅ Good: `import { cn } from '@/utils/ui'` 
  - ❌ Bad: Creating `index.ts` just to re-export `ui.ts`
- **Index Files**: Only create `index.ts` when you have multiple related modules to organize and export
- **Direct Imports**: Prefer direct imports from specific files over index barrel exports when practical

## P2P API Documentation

### Base URL
- **Development**: `http://localhost:5000`
- **Production**: [Your production URL]

### Response Format
All API responses follow a consistent format:

#### Success Response
```typescript
{
  success: true,
  data: T,
  message?: string
}
```

#### Paginated Response
```typescript
{
  success: true,
  data: T[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasNext: boolean,
    hasPrev: boolean
  }
}
```

#### Error Response
```typescript
{
  success: false,
  error: string,
  details?: any
}
```

### Authentication
Most protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### Authentication (`/api/auth`)

##### POST `/api/auth/login`
**Purpose**: User login with email and password
**Payload**:
```typescript
{
  email: string; // Valid email format
  password: string; // Required (any format for existing users)
}
```
**Response**: 
```typescript
{
  success: true,
  data: {
    user: UserProfile,
    accessToken: string,
    refreshToken: string
  }
}
```

##### POST `/api/auth/register`
**Purpose**: User registration
**Payload**:
```typescript
{
  name: string; // 2-255 characters
  email: string; // Valid email format
  password: string; // Strong password (8+ chars, uppercase, lowercase, number, special char)
}
```
**Response**: User profile data with tokens

##### POST `/api/auth/logout`
**Purpose**: User logout
**Auth**: Required
**Payload**: None
**Response**: Success confirmation

##### GET `/api/auth/profile`
**Purpose**: Get current user profile
**Auth**: Required
**Response**: Current user profile data

##### POST `/api/auth/refresh`
**Purpose**: Refresh access token
**Payload**:
```typescript
{
  refreshToken: string
}
```
**Response**: New tokens

##### POST `/api/auth/verify`
**Purpose**: Verify email with token
**Payload**:
```typescript
{
  token: string,
  type: 'signup' | 'email' | 'recovery',
  email?: string
}
```

##### POST `/api/auth/reset-password`
**Purpose**: Request password reset
**Payload**:
```typescript
{
  email: string
}
```

##### PUT `/api/auth/password`
**Purpose**: Update password
**Auth**: Required
**Payload**:
```typescript
{
  password: string, // Strong password
  currentPassword?: string
}
```

##### POST `/api/auth/phone/send-otp`
**Purpose**: Send OTP to phone
**Payload**:
```typescript
{
  phone: string // 10-15 digits with optional +, spaces, -, (, )
}
```

##### POST `/api/auth/phone/verify-otp`
**Purpose**: Verify OTP and login
**Payload**:
```typescript
{
  phone: string,
  otp: string // 6 digits
}
```

##### PUT `/api/auth/phone`
**Purpose**: Update phone number
**Auth**: Required
**Payload**:
```typescript
{
  phone: string
}
```

##### POST `/api/auth/google/signin`
**Purpose**: Sign in with Google
**Payload**:
```typescript
{
  idToken: string,
  accessToken?: string
}
```

##### POST `/api/auth/google/signup`
**Purpose**: Sign up with Google
**Payload**:
```typescript
{
  idToken: string,
  accessToken?: string
}
```

##### POST `/api/auth/resend-verification`
**Purpose**: Resend verification email
**Payload**:
```typescript
{
  email: string
}
```

#### Users (`/api/users`)

##### GET `/api/users/search`
**Purpose**: Search users (public)
**Query Parameters**:
```typescript
{
  search: string, // 1-255 chars
  page?: number, // Default: 1
  limit?: number // Default: 20, max: 100
}
```

##### GET `/api/users/all`
**Purpose**: Get all users (public)
**Response**: Paginated list of users

##### GET `/api/users/:id`
**Purpose**: Get user by ID (public)
**Response**: User profile

##### GET `/api/users/:id/items`
**Purpose**: Get user's items (public)
**Response**: Paginated list of items

##### GET `/api/users/me/profile`
**Purpose**: Get current user profile
**Auth**: Required
**Response**: Detailed user profile

##### PUT `/api/users/me/profile`
**Purpose**: Update current user profile
**Auth**: Required
**Payload**:
```typescript
{
  fullName?: string, // 2-255 chars
  phoneNumber?: string,
  gender?: 'male' | 'female' | 'other' | 'preferNotToSay',
  dob?: string, // YYYY-MM-DD format, 18-100 years old
  dobVisibility?: 'public' | 'friends' | 'private',
  bio?: string, // Max 500 chars
  avatarUrl?: string
}
```

##### GET `/api/users/me/items`
**Purpose**: Get current user's items
**Auth**: Required
**Response**: Paginated list of user's items

##### GET `/api/users/me/bookings`
**Purpose**: Get current user's bookings
**Auth**: Required
**Response**: Paginated list of bookings

##### GET `/api/users/me/favorites`
**Purpose**: Get current user's favorite items
**Auth**: Required
**Response**: Paginated list of favorite items

##### GET `/api/users/me/stats`
**Purpose**: Get current user's statistics
**Auth**: Required
**Response**: User activity statistics

##### DELETE `/api/users/me/account`
**Purpose**: Deactivate current user account
**Auth**: Required
**Response**: Success confirmation

#### Items (`/api/items`)

##### GET `/api/items/search`
**Purpose**: Search items (public)
**Query Parameters**:
```typescript
{
  categoryId?: string,
  location?: {
    latitude: number,
    longitude: number,
    radius?: number // 1-100 km, default: 10
  },
  priceRange?: {
    min?: number,
    max?: number
  },
  condition?: ('new' | 'likeNew' | 'good' | 'fair' | 'poor')[],
  deliveryMode?: ('pickup' | 'delivery' | 'both' | 'none')[],
  availability?: {
    startDate?: string, // YYYY-MM-DD
    endDate?: string
  },
  searchTerm?: string, // Max 255 chars
  sortBy?: 'priceAsc' | 'priceDesc' | 'rating' | 'distance' | 'newest' | 'popular',
  page?: number,
  limit?: number
}
```

##### GET `/api/items/search-by-address`
**Purpose**: Search items by address (public)
**Query Parameters**:
```typescript
{
  addressQuery: string, // 2-200 chars
  radius?: number, // 1-100 km, default: 10
  categoryId?: string,
  priceRange?: { min?: number, max?: number },
  condition?: string[], // Array of conditions
  deliveryMode?: string[], // Array of delivery modes
  availability?: { startDate?: string, endDate?: string },
  searchTerm?: string,
  sortBy?: string, // Default: 'distance'
  page?: number,
  limit?: number
}
```

##### GET `/api/items/popular`
**Purpose**: Get popular items (public)
**Response**: List of popular items

##### GET `/api/items/featured`
**Purpose**: Get featured items (public)
**Response**: List of featured items

##### GET `/api/items/:id`
**Purpose**: Get item by ID (public, optional auth)
**Response**: Item details

##### GET `/api/items/:id/similar`
**Purpose**: Get similar items (public)
**Response**: List of similar items

##### GET `/api/items/:id/availability`
**Purpose**: Check item availability (public)
**Query Parameters**:
```typescript
{
  startDate: string, // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
}
```

##### POST `/api/items`
**Purpose**: Create new item
**Auth**: Required
**Payload**:
```typescript
{
  title: string, // 5-255 chars
  description?: string, // Max 2000 chars
  categoryId: string, // UUID
  condition: 'new' | 'likeNew' | 'good' | 'fair' | 'poor',
  securityAmount?: number, // >= 0
  rentPricePerDay: number, // > 0
  locationId: string, // UUID
  deliveryMode?: 'pickup' | 'delivery' | 'both' | 'none',
  minRentalDays?: number, // >= 1, default: 1
  maxRentalDays?: number, // >= 1, default: 30
  isNegotiable?: boolean,
  tags?: string[] // Max 10 tags, each max 50 chars
}
```

##### PUT `/api/items/:id`
**Purpose**: Update item
**Auth**: Required
**Payload**: Partial item data (same fields as create, all optional)

##### DELETE `/api/items/:id`
**Purpose**: Delete item
**Auth**: Required

##### POST `/api/items/:id/favorites`
**Purpose**: Add item to favorites
**Auth**: Required

##### DELETE `/api/items/:id/favorites`
**Purpose**: Remove item from favorites
**Auth**: Required

##### GET `/api/items/:id/analytics`
**Purpose**: Get item analytics (for item owners)
**Auth**: Required

##### GET `/api/items`
**Purpose**: Get all items (public, optional auth)
**Response**: Paginated list of items

#### Bookings (`/api/bookings`)
*All booking routes require authentication*

##### POST `/api/bookings`
**Purpose**: Create new booking
**Payload**:
```typescript
{
  itemId: string, // UUID
  startDate: string, // YYYY-MM-DD, not in past
  endDate: string, // YYYY-MM-DD, >= startDate
  deliveryMode?: 'pickup' | 'delivery' | 'both' | 'none',
  pickupLocation?: string, // UUID
  deliveryLocation?: string, // UUID
  specialInstructions?: string // Max 1000 chars
}
```

##### GET `/api/bookings/my`
**Purpose**: Get current user's bookings

##### GET `/api/bookings/my/stats`
**Purpose**: Get current user's booking statistics

##### GET `/api/bookings/:id`
**Purpose**: Get booking by ID

##### PUT `/api/bookings/:id/status`
**Purpose**: Update booking status
**Payload**:
```typescript
{
  status: 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled' | 'disputed',
  reason?: string // Max 500 chars
}
```

##### PUT `/api/bookings/:id/confirm`
**Purpose**: Confirm booking

##### PUT `/api/bookings/:id/start`
**Purpose**: Start booking

##### PUT `/api/bookings/:id/complete`
**Purpose**: Complete booking

##### PUT `/api/bookings/:id/cancel`
**Purpose**: Cancel booking
**Payload**:
```typescript
{
  reason: string // 10-500 chars
}
```

##### POST `/api/bookings/:id/rating`
**Purpose**: Add rating and feedback
**Payload**:
```typescript
{
  rating: number, // 1-5
  feedback?: string // Max 1000 chars
}
```

##### GET `/api/bookings`
**Purpose**: Get all bookings (admin)

#### Files (`/api/files`)

##### POST `/api/files/upload`
**Purpose**: Upload single file
**Auth**: Required
**Content-Type**: multipart/form-data
**Form Data**: 
- `file`: File (max 10MB)
**Allowed Types**: JPEG, PNG, GIF, WebP, SVG, PDF, DOC, DOCX, MP4, MPEG, MOV, WebM

##### POST `/api/files/upload/multiple`
**Purpose**: Upload multiple files
**Auth**: Required
**Content-Type**: multipart/form-data
**Form Data**:
- `files`: File[] (max 10 files, 10MB each)

##### POST `/api/files/upload/product-images`
**Purpose**: Upload product images
**Auth**: Required
**Content-Type**: multipart/form-data
**Form Data**:
- `images`: File[] (max 5 images, 5MB each)
**Allowed Types**: JPEG, PNG, WebP only

##### GET `/api/files/my-files`
**Purpose**: Get current user's files
**Auth**: Required

##### GET `/api/files/:id`
**Purpose**: Get file by ID (public)

##### DELETE `/api/files/:id`
**Purpose**: Delete file
**Auth**: Required

#### Addresses (`/api/addresses`)
*Rate limited: 30 requests per 5 minutes*

##### GET `/api/addresses/search`
**Purpose**: Search addresses (public)
**Query Parameters**:
```typescript
{
  query: string, // 2-200 chars
  limit?: number, // 1-50, default: 10
  countryCode?: string, // 2 chars, default: 'IN'
  acceptLanguage?: string // Max 50 chars, default: 'en'
}
```

##### GET `/api/addresses/suggestions`
**Purpose**: Get address suggestions (public)
**Query Parameters**: Same as search

#### Categories (`/api/categories`)

##### GET `/api/categories`
**Purpose**: Get all categories (public)

##### GET `/api/categories/search`
**Purpose**: Search categories (public)
**Query Parameters**:
```typescript
{
  search: string // 1-255 chars
}
```

##### GET `/api/categories/popular`
**Purpose**: Get popular categories (public)

##### GET `/api/categories/:id`
**Purpose**: Get category by ID (public)

##### GET `/api/categories/:id/subcategories`
**Purpose**: Get category subcategories (public)

##### GET `/api/categories/:id/hierarchy`
**Purpose**: Get category hierarchy (public)

##### POST `/api/categories`
**Purpose**: Create category (admin)
**Auth**: Required
**Payload**:
```typescript
{
  categoryName: string, // 2-100 chars
  description?: string, // Max 500 chars
  iconUrl?: string, // Valid URL
  bannerUrl?: string, // Valid URL
  parentCategoryId?: string, // UUID
  sortOrder?: number // >= 0, default: 0
}
```

##### PUT `/api/categories/:id`
**Purpose**: Update category (admin)
**Auth**: Required
**Payload**: Partial category data

#### Cities (`/api/cities`)

##### GET `/api/cities`
**Purpose**: List all cities (public)

### Common Types

#### Enums
```typescript
type ItemCondition = 'new' | 'likeNew' | 'good' | 'fair' | 'poor';
type ItemStatus = 'available' | 'booked' | 'inTransit' | 'delivered' | 'returned' | 'maintenance' | 'inactive';
type BookingStatus = 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled' | 'disputed';
type DeliveryMode = 'pickup' | 'delivery' | 'both' | 'none';
type PaymentMethod = 'card' | 'upi' | 'wallet' | 'bankTransfer' | 'cash';
type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partiallyRefunded';
type UserGender = 'male' | 'female' | 'other' | 'preferNotToSay';
type FileType = 'image' | 'document' | 'video' | 'other';
```

#### Location Object
```typescript
{
  id: string,
  addressLine: string, // 5-255 chars
  city: string, // 2-100 chars
  state: string, // 2-100 chars
  pincode: string, // 6 digits
  country?: string, // Default: 'India'
  latitude?: number, // -90 to 90
  longitude?: number, // -180 to 180
  createdAt: string,
  updatedAt: string
}
```

### Error Handling
- **400**: Bad Request - Validation errors, malformed requests
- **401**: Unauthorized - Missing or invalid authentication
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource doesn't exist
- **409**: Conflict - Duplicate data, constraint violations
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - Unexpected server errors

### Rate Limits
- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **File Upload**: 20 requests per hour per IP
- **Address Search**: 30 requests per 5 minutes per IP