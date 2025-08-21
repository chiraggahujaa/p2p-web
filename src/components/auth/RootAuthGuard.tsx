'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface RootAuthGuardProps {
  children: React.ReactNode;
}

export function RootAuthGuard({ children }: RootAuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    hasRedirected.current = false;
  }, [pathname]);

  useEffect(() => {
    if (isLoading || hasRedirected.current) return;

    const publicPages = ['/', '/signin', '/signup', '/reset-password', '/email-confirmation', '/verify-email'];
    const isPublicPage = publicPages.includes(pathname);
    
    // Case 1: User not authenticated but on private page - redirect to signin
    if (!isAuthenticated && !isPublicPage) {
      hasRedirected.current = true;
      router.replace('/signin');
      return;
    }

    // Case 2: User authenticated but on auth pages - redirect to home page (/)  
    if (isAuthenticated && ['/signin', '/signup'].includes(pathname)) {
      hasRedirected.current = true;
      router.replace('/');
      return;
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}