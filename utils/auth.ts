import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

export async function signOut() {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear any cached auth state
    await supabase.auth.getSession();
    
    // Force clear cookies and local storage
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    localStorage.clear();
    
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
}

export async function resetPassword(email: string) {
  const supabase = createClientComponentClient<Database>();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback`,
  });
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const supabase = createClientComponentClient<Database>();
  const { error } = await supabase.auth.updateUser({
    password,
  });
  if (error) throw error;
}