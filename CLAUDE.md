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

## Backend API Reference

For backend API documentation, types, and endpoint specifications, please refer to:
```
../p2p-api/CLAUDE.md
```