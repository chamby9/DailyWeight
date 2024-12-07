'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WeightEntryModal from '@/components/WeightEntryModal';
import WeightEntries from '@/components/WeightEntries';
import WeightChart from '@/components/WeightChart';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out...');
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleWeightAdded = () => {
    setIsModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

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
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Weight Progress</h3>
              <WeightChart />
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
      </div>
    </div>
  );
}