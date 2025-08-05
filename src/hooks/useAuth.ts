import { useCallback } from 'react';
import { useAppStore } from '@/stores/useAppStore';

// Custom hook for authentication logic
export const useAuth = () => {
  const { user, isLoading, error, setUser, setLoading, setError, clearError, logout } = useAppStore();

  // Login function (placeholder - integrate with Supabase later)
  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      
      // TODO: Replace with actual Supabase auth
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (_err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError, clearError]);

  // Register function (placeholder - integrate with Supabase later)
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      
      // TODO: Replace with actual Supabase auth
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (_err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError, clearError]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
  };
};