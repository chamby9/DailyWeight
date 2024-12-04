'use client';

import React, { useRef } from 'react';
import WeightForm from '@/components/WeightForm';
import WeightChart, { WeightChartRef } from '@/components/WeightChart';

const HomePage: React.FC = () => {
  const chartRef = useRef<WeightChartRef>(null);

  const handleAddWeight = async () => {
    // Refresh the chart when a new weight is added
    if (chartRef.current) {
      await chartRef.current.fetchWeights();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">DailyWeight</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add Weight Entry</h2>
          <WeightForm onWeightAdded={handleAddWeight} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Weight History</h2>
          <WeightChart ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;