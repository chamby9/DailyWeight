// app/components/WeightForm.tsx
'use client';
import React, { useState } from 'react';

interface WeightFormProps {
  onAddWeight: (date: string, weight: number) => void;
}

const WeightForm: React.FC<WeightFormProps> = ({ onAddWeight }) => {
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWeight(date, weight);
    setDate('');
    setWeight(0);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Date</span>
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input input-bordered"
          required
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Weight (kg)</span>
        </label>
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="input input-bordered"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary mt-4">
        Add Weight
      </button>
    </form>
  );
};

export default WeightForm;