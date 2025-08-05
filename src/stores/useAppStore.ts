import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Define the store state interface
interface AppState {
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
  } | null;
  isLoading: boolean;
  error: string | null;
}

// Define the store actions interface
interface AppActions {
  setUser: (user: AppState['user']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
}

// Combine state and actions
type AppStore = AppState & AppActions;

// Create the Zustand store
export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      // Initial state
      user: null,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user }, false, 'setUser'),
      setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
      setError: (error) => set({ error }, false, 'setError'),
      clearError: () => set({ error: null }, false, 'clearError'),
      logout: () => set({ user: null, error: null }, false, 'logout'),
    }),
    {
      name: 'app-store', // Name for Redux DevTools
    }
  )
);