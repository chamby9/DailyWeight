'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { signOut } from '@/utils/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, error } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Let middleware handle redirects, just show error if there is one
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded">
        An error occurred. Please try signing in again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-6">
          <button 
            onClick={handleSignOut}
            className="btn btn-outline"
          >
            Sign Out
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}