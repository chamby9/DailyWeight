// app/dashboard/layout.tsx
'use client';

import { signOut } from '@/utils/auth';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-end p-4">
        <button 
          onClick={handleSignOut}
          className="btn btn-outline"
        >
          Sign Out
        </button>
      </div>
      {children}
    </div>
  );
}