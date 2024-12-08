'use client';

import { useState, useEffect } from 'react';
import { Edit2, Plus } from 'lucide-react';
import WeightGoalModal from './WeightGoalModal';

interface WeightGoal {
  id: string;
  target_weight: number;
  start_date: string;
  target_date: string | null;
  status: 'active' | 'achieved' | 'abandoned';
  notes: string | null;
}

export default function WeightGoal() {
  const [currentGoal, setCurrentGoal] = useState<WeightGoal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentGoal();
  }, []);

  const fetchCurrentGoal = async () => {
    try {
      const response = await fetch('/api/weight-goals/current');
      if (!response.ok) throw new Error('Failed to fetch goal');
      const data = await response.json();
      setCurrentGoal(data);
    } catch (err) {
      setError('Failed to load goal');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading loading-spinner"></div>;
  if (error) return <div className="text-error">{error}</div>;

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Weight Goal</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-ghost btn-sm"
        >
          {currentGoal ? <Edit2 size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {currentGoal ? (
        <div className="space-y-2">
          <div className="stat-value text-primary">{currentGoal.target_weight} kg</div>
          <div className="text-sm text-base-content/70">
            Target Date: {currentGoal.target_date ? new Date(currentGoal.target_date).toLocaleDateString() : 'No date set'}
          </div>
          {currentGoal.notes && (
            <div className="text-sm mt-2 text-base-content/70">
              {currentGoal.notes}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-base-content/70">No goal set</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary btn-sm mt-2"
          >
            Set a Goal
          </button>
        </div>
      )}

      {isModalOpen && (
        <WeightGoalModal
          currentGoal={currentGoal}
          onClose={() => setIsModalOpen(false)}
          onGoalUpdated={() => {
            fetchCurrentGoal();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
} 