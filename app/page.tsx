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
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">DailyWeight</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Weight Entry Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Add Weight Entry</h2>
              <WeightForm onWeightAdded={handleAddWeight} />
            </div>
          </div>
          
          {/* Weight History Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Weight History</h2>
              <WeightChart ref={chartRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;