'use client';

import { useEffect, useState } from 'react';
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
  ChartData as ChartJSData,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeightChartData {
  date: string;
  weight: number;
  rolling_average: number | null;
}

// Add interfaces for API responses
interface WeightEntry {
  date: string;
  weight: number;
}

interface StatEntry {
  entry_date: string;
  rolling_average: number;
}

export default function WeightChart() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<WeightChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both weight entries and statistics
        const [entriesRes, statsRes] = await Promise.all([
          fetch('/api/weights/chart'),
          fetch('/api/weights/stats/all')
        ]);

        if (!entriesRes.ok || !statsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const entries = await entriesRes.json() as WeightEntry[];
        const stats = await statsRes.json() as StatEntry[];

        // Combine and sort the data
        const combinedData = entries.map((entry: WeightEntry) => ({
          date: entry.date,
          weight: entry.weight,
          rolling_average: stats.find((stat: StatEntry) => 
            stat.entry_date === entry.date
          )?.rolling_average || null
        })).sort((a: WeightChartData, b: WeightChartData) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setChartData(combinedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chart data');
        console.error('Error fetching chart data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-error">
        {error}
      </div>
    );
  }

  const data: ChartJSData<'line'> = {
    labels: chartData.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight',
        data: chartData.map(d => d.weight),
        borderColor: 'rgb(59, 130, 246)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        pointRadius: 4,
        tension: 0.1,
      },
      {
        label: '7-Day Average',
        data: chartData.map(d => d.rolling_average),
        borderColor: 'rgb(34, 197, 94)', // Green
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        pointRadius: 0,
        borderDash: [5, 5],
        tension: 0.4,
      }
    ]
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
        text: 'Weight Progress'
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}