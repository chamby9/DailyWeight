// app/page.tsx
'use client';
import React, { useState } from 'react';
import WeightForm from './components/WeightForm';
import WeightChart from './components/WeightChart';

const HomePage: React.FC = () => {
  const [weights, setWeights] = useState<{ date: string; weight: number }[]>([]);

  const handleAddWeight = (date: string, weight: number) => {
    setWeights([...weights, { date, weight }]);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">DailyWeight</h1>
      <WeightForm onAddWeight={handleAddWeight} />
      <WeightChart weights={weights} />
    </div>
  );
};

export default HomePage;