import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Define the user interface
interface User {
  id: string;
  email: string;
  name: string | null;
  emailConfirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Define the store state interface
interface AppState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  selectedCity: string | null;
  startDate: string | null;
  endDate: string | null;
  proximityEnabled: boolean;
  proximityRadius: number;
}

// Define the store actions interface
interface AppActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  setSelectedCity: (city: string | null) => void;
  setDateRange: (dates: { startDate: string | null; endDate: string | null }) => void;
  setProximityEnabled: (enabled: boolean) => void;
  setProximityRadius: (radius: number) => void;
  setProximitySettings: (settings: { enabled: boolean; radius: number }) => void;
}

// Combine state and actions
type AppStore = AppState & AppActions;

// Create the Zustand store
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        user: null,
        isLoading: true, // Start with loading true to prevent premature redirects
        error: null,
        selectedCity: null,
        startDate: null,
        endDate: null,
        proximityEnabled: true, // Default to enabled
        proximityRadius: 25, // Default 25km radius
        

        // Actions
        setUser: (user) => set({ user, error: null }, false, 'setUser'),
        
        setLoading: (isLoading) => set(
          { isLoading }, 
          false, 
          'setLoading'
        ),
        
        setError: (error) => set(
          { error }, 
          false, 
          'setError'
        ),
        
        clearError: () => set(
          { error: null }, 
          false, 
          'clearError'
        ),
        
        logout: () => {
          // Clear tokens from storage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
          }
          
          set(
            { user: null, error: null }, 
            false, 
            'logout'
          );
        },
        
        setTokens: (accessToken, refreshToken) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
          }
        },
        
        clearTokens: () => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
          }
        },
        
        setSelectedCity: (city) => set({ selectedCity: city }, false, 'setSelectedCity'),
        setDateRange: ({ startDate, endDate }) => set({ startDate, endDate }, false, 'setDateRange'),
        setProximityEnabled: (enabled) => set({ proximityEnabled: enabled }, false, 'setProximityEnabled'),
        setProximityRadius: (radius) => set({ proximityRadius: radius }, false, 'setProximityRadius'),
        setProximitySettings: ({ enabled, radius }) => set({ proximityEnabled: enabled, proximityRadius: radius }, false, 'setProximitySettings'),
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          user: state.user,
          selectedCity: state.selectedCity,
          proximityEnabled: state.proximityEnabled,
          proximityRadius: state.proximityRadius,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
);