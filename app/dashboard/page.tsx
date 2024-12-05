"use client";

import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
      <p className="text-gray-600 mb-4">
        You are signed in as {user?.email}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
          <p className="text-gray-600">
            Start tracking your weight to see your progress here.
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Recent Entries</h3>
          <p className="text-gray-600">
            Your recent weight entries will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
