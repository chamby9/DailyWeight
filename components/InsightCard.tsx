import { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';

interface Insight {
  insight: string;
  generated_at: string;
}

export default function InsightCard() {
  const [insightData, setInsightData] = useState<Insight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/insights');
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 400 && data.error === 'No weight entry for today') {
          setInsightData(null);
          return;
        }
        throw new Error('Failed to fetch insight');
      }
      const data = await response.json();
      setInsightData(data);
    } catch (err) {
      setError('Unable to load insight');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, []);

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Insight</h3>
        </div>
        <div className="flex items-center gap-2">
          {insightData && (
            <>
              <span className="text-sm text-gray-500">
                {new Date(insightData.generated_at).toLocaleString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit'
                })}
              </span>
              {/* Only show refresh button if no insight for today */}
              {new Date(insightData.generated_at).toISOString().split('T')[0] !== 
               new Date().toISOString().split('T')[0] && (
                <button 
                  onClick={fetchInsight}
                  disabled={isLoading}
                  className="btn btn-ghost btn-sm"
                  aria-label="Refresh insight"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="min-h-[80px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <div className="loading loading-spinner loading-sm"></div>
          </div>
        ) : error ? (
          <p className="text-red-600 text-sm">{error}</p>
        ) : insightData?.insight ? (
          <p className="text-gray-700 leading-relaxed">{insightData.insight}</p>
        ) : (
          <p className="text-gray-500 text-center">Add today&apos;s weight to get an AI insight</p>
        )}
      </div>
    </div>
  );
} 