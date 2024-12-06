// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      // Clear any local storage if needed
      localStorage.removeItem('supabase.auth.token');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error instanceof Error ? error : new Error('Error signing out'));
    }
  }, [router]);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (mounted) {
          if (session?.user) {
            setUser(session.user);
          }
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Auth initialization error:', err);
          setError(err instanceof Error ? err : new Error('Authentication failed'));
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      try {
        if (event === 'SIGNED_IN') {
          setUser(session?.user ?? null);
          setError(null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setError(null);
        } else if (event === 'USER_UPDATED') {
          setUser(session?.user ?? null);
          setError(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err instanceof Error ? err : new Error('Auth state change failed'));
      } finally {
        setLoading(false);
      }
    });

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    error,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}