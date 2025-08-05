import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Frontend Supabase Client Factory following industry best practices
class SupabaseClientFactory {
  private static instance: SupabaseClientFactory;
  private client: SupabaseClient | null = null;
  private readonly config: {
    url: string;
    anonKey: string;
  };

  private constructor() {
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    }
    if (!supabaseAnonKey) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
    }

    this.config = {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    };
  }

  // Singleton instance getter with lazy initialization
  public static getInstance(): SupabaseClientFactory {
    if (!SupabaseClientFactory.instance) {
      SupabaseClientFactory.instance = new SupabaseClientFactory();
    }
    return SupabaseClientFactory.instance;
  }

  /**
   * Get the Supabase client instance
   * Configured for frontend use with proper session handling
   */
  public getClient(): SupabaseClient {
    if (!this.client) {
      this.client = createClient(this.config.url, this.config.anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true, // Frontend should detect auth callback URLs
          flowType: 'pkce', // Use PKCE flow for better security
        },
        db: {
          schema: 'public',
        },
        global: {
          headers: {
            'X-Client-Info': 'supabase-frontend-client',
          },
        },
        // Realtime configuration for frontend
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });

      // Log successful initialization in development
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Supabase Client initialized successfully');
      }
    }
    return this.client;
  }

  /**
   * Health check method to verify connectivity
   */
  public async healthCheck(): Promise<boolean> {
    try {
      const client = this.getClient();
      const { error } = await client.from('users').select('id').limit(1);
      return !error;
    } catch (error) {
      console.error('Frontend client health check failed:', error);
      return false;
    }
  }

  /**
   * Reset client (useful for testing or configuration changes)
   */
  public reset(): void {
    this.client = null;
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Supabase client reset');
    }
  }
}

// Create and export the client factory instance
const supabaseFactory = SupabaseClientFactory.getInstance();

// Main client export - this should be used throughout the frontend application
export const supabase = supabaseFactory.getClient();

// Export factory for advanced use cases
export { supabaseFactory };

// Export types
export type { SupabaseClient };

// Helper functions for common operations
export const auth = supabase.auth;

// Health check export
export const checkSupabaseHealth = () => supabaseFactory.healthCheck();

export const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};