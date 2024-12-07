'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  userId: string;
}

interface WeightStats {
  weight_change: number | null;
  rolling_average: number | null;
}

export default function WeightEntries() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [stats, setStats] = useState<WeightStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      // Fetch entries
      const entriesResponse = await fetch(`/api/weights?userId=${user.id}`);
      if (!entriesResponse.ok) throw new Error('Failed to fetch entries');
      const entriesData = await entriesResponse.json();
      setEntries(entriesData);

      // Fetch latest statistics
      const statsResponse = await fetch(`/api/weights/stats?userId=${user.id}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (err) {
      setError('Failed to load weight entries');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <div className="loading loading-spinner"></div>;
  }

  if (error) {
    return <div className="text-error">{error}</div>;
  }

  return (
    <div>
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-lg p-4">
            <div className="stat-title">Last Change</div>
            <div className={`stat-value ${stats.weight_change && stats.weight_change < 0 ? 'text-success' : 'text-error'}`}>
              {stats.weight_change ? `${stats.weight_change > 0 ? '+' : ''}${stats.weight_change} kg` : 'N/A'}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-lg p-4">
            <div className="stat-title">7-Day Average</div>
            <div className="stat-value">
              {stats.rolling_average ? `${stats.rolling_average} kg` : 'N/A'}
            </div>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight (kg)</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{new Date(entry.date).toLocaleDateString()}</td>
                <td>{entry.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}