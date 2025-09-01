# P2P Rental Platform - Frontend

A modern React/Next.js frontend for a peer-to-peer rental marketplace with responsive design and real-time features.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Supabase Client
- **Authentication**: Supabase Auth & Google OAuth

## 📦 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env.local` file in the frontend root:
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Start Development Server
```bash
npm run dev
```

App will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/             # Next.js App Router pages
├── components/      # Reusable React components
├── hooks/           # Custom React hooks
├── lib/             # External service configs
├── stores/          # Zustand state management
├── types/           # TypeScript interfaces
└── styles/          # Global styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run type-check` - Run TypeScript checks

## 🎨 Key Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Authentication** - Secure user login/signup with Supabase Auth & Google OAuth
- **Real-time Updates** - Live data synchronization
- **Item Browsing** - Search, filter, and browse rental items
- **Booking Management** - Create and manage bookings
- **User Profiles** - Comprehensive user profile management
- **Dark Mode** - Theme switching capability

## 🏗️ Development Guidelines

### Component Structure
```tsx
// components/ComponentName/index.tsx
export default function ComponentName() {
  return <div>Component content</div>
}
```

### State Management
```tsx
// stores/useAppStore.ts
import { create } from 'zustand'

interface AppState {
  user: User | null
  setUser: (user: User | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

### API Integration
```tsx
// hooks/useAuth.ts

export function useAuth() {
  // Authentication logic
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

For backend setup, check the `../backend/README.md`