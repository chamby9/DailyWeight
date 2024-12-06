// utils/auth.ts
import { supabase } from '@/lib/supabase';

/**
 * Flag to track whether the auth state has been checked
 */
let authStateChecked = false;

/**
 * Marks the auth state as checked
 */
export const markAuthStateAsChecked = () => {
  authStateChecked = true;
};

/**
 * Returns whether the auth state has been checked
 */
export const hasAuthStateBeenChecked = () => {
  return authStateChecked;
};

/**
 * Clears the auth state and local storage
 */
export const clearAuthState = () => {
  localStorage.removeItem('supabase.auth.token');
  localStorage.removeItem('supabase.auth.expires_at');
  localStorage.removeItem('supabase.auth.refresh_token');
  authStateChecked = false;
};

/**
 * Signs out the user and clears auth state
 */
export const signOut = async () => {
  try {
    await supabase.auth.signOut();
    clearAuthState();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};