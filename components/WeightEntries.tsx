'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  userId: string;
}

export default function WeightEntries() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchEntries = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/weights?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch entries');
      
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      setError('Failed to load weight entries');
      console.error('Error fetching entries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user?.id]); // Re-fetch when user ID changes

  if (isLoading) {
    return <div className="loading loading-spinner"></div>;
  }

  if (error) {
    return <div className="text-error">{error}</div>;
  }

  return (
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
  );
}