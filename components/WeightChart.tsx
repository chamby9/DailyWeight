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
  Filler,
  TimeScale,
  ChartOptions
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
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
        const [entriesRes, statsRes] = await Promise.all([
          fetch('/api/weights/chart'),
          fetch('/api/weights/stats/all')
        ]);

        if (!entriesRes.ok || !statsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const entries = await entriesRes.json() as WeightEntry[];
        const stats = await statsRes.json() as StatEntry[];

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

  if (isLoading) return <div className="loading loading-spinner"></div>;
  if (error) return <div className="text-error">{error}</div>;

  const options: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#666',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'dd/MM/yy'
          }
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  const data = {
    labels: chartData.map(d => d.date),
    datasets: [
      {
        label: 'Weight',
        data: chartData.map(d => d.weight),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        fill: true,
        tension: 0.2,
      },
      {
        label: '7-Day Average',
        data: chartData.map(d => d.rolling_average),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        fill: '-1', // Fill to the previous dataset
        tension: 0.4,
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Weight Progress</h2>
      <Line options={options} data={data} />
    </div>
  );
}