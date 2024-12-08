'use client';

import { useState } from 'react';

interface WeightFormProps {
  onWeightAdded: () => void;
}

export default function WeightForm({ onWeightAdded }: WeightFormProps) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEntry = () => {
    // Check for future dates
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      throw new Error("Cannot add weight entries for future dates");
    }

    // Validate weight range (e.g., 20kg to 500kg)
    const weightNum = parseFloat(weight);
    if (weightNum < 20 || weightNum > 500) {
      throw new Error("Weight must be between 20kg and 500kg");
    }

    // Validate against extremely rapid weight changes
    // You might want to fetch the last entry here and compare
    // For now, we'll do this on the server side
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      validateEntry();
      const response = await fetch('/api/weights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight: parseFloat(weight),
          date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add weight entry');
      }

      setWeight('');
      setDate(new Date().toISOString().split('T')[0]);
      
      // Trigger insight generation
      await fetch('/api/insights');
      
      onWeightAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add weight entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-base-content">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input input-bordered w-full bg-base-100 text-base-content"
          max={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div>
        <label className="text-base-content">
          Weight (kg)
        </label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter weight"
          className="input input-bordered w-full bg-base-100 text-base-content placeholder:text-base-content/50"
          step="0.1"
          required
        />
      </div>

      {error && <div className="text-error text-sm">{error}</div>}

      <button
        type="submit"
        className="btn btn-primary w-full text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : 'Add Weight'}
      </button>
    </form>
  );
}