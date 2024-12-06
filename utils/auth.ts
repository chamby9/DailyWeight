// utils/auth.ts

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