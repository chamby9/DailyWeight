// app/components/WeightChart.tsx
'use client';
import React from 'react';
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

interface WeightChartProps {
  weights: { date: string; weight: number }[];
}

const WeightChart: React.FC<WeightChartProps> = ({ weights }) => {
  const data = {
    labels: weights.map((entry) => entry.date),
    datasets: [
      {
        label: 'Weight (kg)',
        data: weights.map((entry) => entry.weight),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weight Trends',
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default WeightChart;