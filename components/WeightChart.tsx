'use client';

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { WeightEntry } from '@/lib/supabase';

export interface WeightChartRef {
  fetchWeights: () => Promise<void>;
}

const WeightChart = forwardRef<WeightChartRef>((props, ref) => {
  const [weights, setWeights] = useState<WeightEntry[]>([]);
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

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={weights}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis 
            domain={['auto', 'auto']}
            label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            formatter={(value) => [`${value} kg`, 'Weight']}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

WeightChart.displayName = 'WeightChart';

export default WeightChart;