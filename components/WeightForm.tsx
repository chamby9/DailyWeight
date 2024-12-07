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
      onWeightAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add weight entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Date</span>
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Weight (kg)</span>
        </label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          step="0.1"
          min="20"
          max="500"
          className="input input-bordered w-full"
          placeholder="Enter weight"
          required
        />
      </div>

      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full"
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner"></span>
            Adding...
          </>
        ) : (
          'Add Weight'
        )}
      </button>
    </form>
  );
}