import { supabase } from '@/lib/supabase';

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback`,
  });
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  });
  if (error) throw error;
}