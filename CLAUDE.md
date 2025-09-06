# Claude Code Configuration

## Git Commit Guidelines

When creating git commits, do not include:
- Claude watermark ("🤖 Generated with [Claude Code](https://claude.ai/code)")
- Co-authored by Claude attribution ("Co-Authored-By: Claude <noreply@anthropic.com>")

Keep commit messages clean and professional without AI attribution.

## Project Architecture

### Tech Stack
- **Frontend**: Next.js 15+ with App Router (Turbopack enabled)
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State Management**: Zustand with persist and devtools middleware
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner for toast messages
- **Authentication**: Custom JWT-based auth with Google OAuth

### Directory Structure

#### Feature-Based Organization
Use the `features/{featureName}/` structure for all feature-specific code:

```
src/features/{featureName}/
├── components/          # Feature-specific components
│   ├── forms/          # Form components for the feature
│   └── tabs/           # Tab-based UI components
├── hooks/              # Feature-specific custom hooks
├── types/              # TypeScript interfaces and types
└── validations/        # Zod schemas and validation logic
```

**Examples:**
- `src/features/products/` - Product management functionality
- `src/features/profile/` - User profile management
- `src/features/home/` - Homepage and browsing features

#### Global Directories
- `src/app/` - Next.js App Router pages and layouts
  - `(private)/` - Authenticated routes
  - `(public)/` - Public routes  
  - `(auth)/` - Authentication routes
- `src/components/` - Shared/global components
  - `ui/` - shadcn/ui components
  - `common/` - Reusable common components
  - `layout/` - Layout-specific components
  - `forms/` - Generic form components
- `src/hooks/` - Global custom hooks (e.g., `useAuth.ts`)
- `src/lib/` - Utilities and configurations
  - `api/` - API client functions
  - `utils/` - Helper utilities
  - `validations/` - Global validation schemas
- `src/stores/` - Zustand stores
- `src/types/` - Global TypeScript definitions
- `src/providers/` - React context providers

## Code Patterns & Standards

### Component Structure
```typescript
"use client"; // For client components

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Hooks first
  const { data, isLoading } = useQuery({
    queryKey: ["key"],
    queryFn: apiFunction,
  });

  // Early returns for loading states
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content */}
      </CardContent>
    </Card>
  );
}
```

### Custom Hooks Patterns
```typescript
export const useFeatureData = (params: ParamsType) => {
  const { data, isLoading } = useQuery({
    queryKey: ["feature", params],
    queryFn: () => apiCall(params),
    enabled: Boolean(params),
  });

  return {
    data,
    isLoading,
  };
};
```

### API Integration
- Use TanStack Query for all server state management
- Implement proper loading states with `LoadingSpinner`
- Handle errors with toast notifications using `sonner`
- Structure API calls in `src/lib/api/` directory

### Form Handling
```typescript
// Use React Hook Form with Zod validation
const form = useForm({
  resolver: zodResolver(validationSchema),
  defaultValues: initialValues,
});

const { register, watch, setValue, formState: { errors } } = form;
```

### State Management
- Use Zustand for global state (see `useAppStore.ts` pattern)
- Include devtools and persist middleware for stores
- Structure state with clear interfaces for state and actions
- Use proper action naming for devtools tracking

### Error Handling & UX
- Use `toast.success()` and `toast.error()` for user feedback
- Implement proper validation error display in forms
- Use consistent error message patterns
- Handle loading states with appropriate UI feedback

### TypeScript Conventions
- Define clear interfaces for component props
- Use proper typing for API responses
- Create feature-specific types in `features/{name}/types/`
- Maintain global types in `src/types/`

### Import Organization
```typescript
// External libraries first
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// UI components
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// API and utilities
import { apiFunction } from "@/lib/api/feature";
import { cn } from "@/lib/utils";

// Types and local imports
import { ComponentProps } from "../types/formTypes";
```

### File Organization Standards
- **Features**: Always use `features/{featureName}/` for feature-specific code
- **Direct Imports**: Prefer direct imports over barrel exports
- **Index Files**: Only create when organizing multiple related exports
- **Naming**: Use PascalCase for components, camelCase for functions/variables
- **File Extensions**: `.tsx` for React components, `.ts` for utilities/types

## Development Scripts

Available commands:
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically  
- `npm run type-check` - Run TypeScript type checking
- `npm run validate` - Run pre-commit validation (lefthook)

## Backend API Reference

For backend API documentation, types, and endpoint specifications, please refer to:
```
../p2p-api/CLAUDE.md
```