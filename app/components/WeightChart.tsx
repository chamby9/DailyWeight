'use client';

import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface WeightChartRef {
  fetchWeights: () => Promise<void>;
}

const WeightChart = forwardRef<WeightChartRef>((props, ref) => {
  const [weights, setWeights] = useState<{ date: string; weight: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeights = async () => {
    try {
      const response = await fetch('/api/weights');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch weights');
      }
      const data = await response.json();
      setWeights(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weight data');
      console.error('Error fetching weights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchWeights
  }));

  useEffect(() => {
    fetchWeights();
  }, []);

  if (isLoading) return (
    <div className="flex justify-center items-center h-96">
      <div className="text-gray-600">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-96">
      <div className="text-red-500">{error}</div>
    </div>
  );

  if (weights.length === 0) return (
    <div className="flex justify-center items-center h-96">
      <div className="text-gray-600">No weight entries yet</div>
    </div>
  );

  const data = {
    labels: weights.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (kg)',
        data: weights.map(entry => entry.weight),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weight History',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: number) => `${value} kg`,
        },
      },
    },
  };

  return (
    <div className="h-96 w-full">
      <Line options={options} data={data} />
    </div>
  );
});

WeightChart.displayName = 'WeightChart';

export default WeightChart;