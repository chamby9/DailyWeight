'use client';

import { useState } from 'react';

interface WeightGoal {
  id: string;
  target_weight: number;
  target_date: string | null;
  notes: string | null;
}

interface WeightGoalModalProps {
  currentGoal: WeightGoal | null;
  onClose: () => void;
  onGoalUpdated: () => void;
}

export default function WeightGoalModal({ currentGoal, onClose, onGoalUpdated }: WeightGoalModalProps) {
  const [targetWeight, setTargetWeight] = useState(currentGoal?.target_weight?.toString() || '');
  const [targetDate, setTargetDate] = useState(currentGoal?.target_date || '');
  const [notes, setNotes] = useState(currentGoal?.notes || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/weight-goals', {
        method: currentGoal ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentGoal?.id,
          target_weight: parseFloat(targetWeight),
          target_date: targetDate || null,
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save goal');
      }

      onGoalUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save goal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {currentGoal ? 'Update Goal' : 'Set New Goal'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Target Weight (kg)</span>
            </label>
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="input input-bordered w-full"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Target Date (optional)</span>
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="input input-bordered w-full"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Notes (optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="textarea textarea-bordered w-full"
              rows={3}
            />
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 