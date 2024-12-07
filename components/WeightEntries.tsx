'use client';
import { useEffect, useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';

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

export default function WeightEntries({ onDataChange }: { onDataChange?: () => void }) {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [latestStats, setLatestStats] = useState<WeightStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [entriesResponse, statsResponse] = await Promise.all([
        fetch('/api/weights'),
        fetch('/api/weights/stats') // This endpoint returns the most recent stats
      ]);

      if (!entriesResponse.ok) throw new Error('Failed to fetch entries');
      
      const entriesData = await entriesResponse.json();
      setEntries(entriesData);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setLatestStats(statsData);
      }
    } catch (err) {
      setError('Failed to load weight entries');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    setIsDeleting(entryId);
    try {
      const response = await fetch(`/api/weights/${entryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      await fetchData(); // This will refresh both entries and stats
      if (onDataChange) {
        onDataChange();
      }
    } catch (err) {
      setError('Failed to delete entry');
      console.error('Error deleting entry:', err);
    } finally {
      setIsDeleting(null);
    }
  };

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
      {latestStats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-lg p-4">
            <div className="stat-title">Last Change</div>
            <div className={`stat-value ${latestStats.weight_change && latestStats.weight_change < 0 ? 'text-success' : 'text-error'}`}>
              {latestStats.weight_change ? `${latestStats.weight_change > 0 ? '+' : ''}${latestStats.weight_change} kg` : 'N/A'}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-lg p-4">
            <div className="stat-title">7-Day Average</div>
            <div className="stat-value">
              {latestStats.rolling_average ? `${latestStats.rolling_average} kg` : 'N/A'}
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{new Date(entry.date).toLocaleDateString()}</td>
                <td>{entry.weight}</td>
                <td>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={isDeleting === entry.id}
                    className="btn btn-ghost btn-sm text-error"
                    title="Delete entry"
                  >
                    {isDeleting === entry.id ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}