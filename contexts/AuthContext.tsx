// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { markAuthStateAsChecked, hasAuthStateBeenChecked, clearAuthState } from '@/utils/auth';
import { useRouter, usePathname } from 'next/navigation';

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
  const [loading, setLoading] = useState(!hasAuthStateBeenChecked());
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      clearAuthState();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error instanceof Error ? error : new Error('Error signing out'));
    }
  }, [router]);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (mounted) {
          if (session?.user) {
            setUser(session.user);
          } else if (pathname.startsWith('/dashboard')) {
            router.push('/auth/login');
          }
          markAuthStateAsChecked();
        }
      } catch (err) {
        if (mounted) {
          console.error('Session check error:', err);
          setError(err instanceof Error ? err : new Error('Session check failed'));
          if (pathname.startsWith('/dashboard')) {
            router.push('/auth/login');
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        clearAuthState();
        if (pathname.startsWith('/dashboard')) {
          router.push('/auth/login');
        }
      } else if (session?.user) {
        setUser(session.user);
        markAuthStateAsChecked();
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

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