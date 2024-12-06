'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import WeightEntryModal from '@/components/WeightEntryModal';
import WeightEntries from '@/components/WeightEntries';

export default function Dashboard() {
  const { user, loading, error } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        An error occurred: {error.message}
      </div>
    );
  }

  const handleWeightAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Welcome!</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          Add Weight
        </button>
      </div>
      
      <p className="text-gray-600 mb-6">
        You are signed in as {user?.email}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
          <div className="text-gray-600">
            Start tracking your weight to see your progress here.
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Recent Entries</h3>
          <WeightEntries key={refreshTrigger} />
        </div>
      </div>

      <WeightEntryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWeightAdded={handleWeightAdded}
      />
    </div>
  );
}