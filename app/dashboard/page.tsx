'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WeightEntryModal from '@/components/WeightEntryModal';
import WeightEntries from '@/components/WeightEntries';
import WeightChart from '@/components/WeightChart';
import Link from 'next/link';
import InsightCard from '@/components/InsightCard';
import { useRouter } from 'next/navigation';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { WeightGoal } from '@/types/weight';
import WeightGoalComponent from '@/components/WeightGoal';

interface Stats {
  currentWeight: number | null;
  goalWeight: number | null;
  weightLost: string | null;
  dailyAverage: string | null;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();
  const [goalWeight, setGoalWeight] = useState<number | null>(null);
  const [targetDate, setTargetDate] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    currentWeight: null,
    goalWeight: null,
    weightLost: null,
    dailyAverage: null,
  });
  const [weightGoal, setWeightGoal] = useState<WeightGoal | null>(null);

  const fetchStats = useCallback(async () => {
    console.log('fetchStats called');
    try {
      const supabase = createClientComponentClient();
      
      // Log the raw query first
      const weightQuery = await supabase
        .from('weights')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });
      console.log('All weight entries:', weightQuery);

      // Fetch latest weight with error checking
      const { data: latestWeight, error: latestError } = await supabase
        .from('weights')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(1)
        .single();
      console.log('Latest weight query:', { 
        data: latestWeight, 
        error: latestError,
        sql: latestWeight ? Object.keys(latestWeight) : null
      });

      // Fetch goal weight with error checking
      const { data: weightGoalData, error: goalError } = await supabase
        .from('weight_goals')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      console.log('Weight goal query:', { 
        data: weightGoalData, 
        error: goalError,
        targetDate: weightGoalData?.target_date,
        startDate: weightGoalData?.start_date,
        sql: weightGoalData ? Object.keys(weightGoalData) : null
      });

      // Fetch all entries since goal date with error checking
      const { data: entries, error: entriesError } = await supabase
        .from('weights')
        .select('weight, date')
        .eq('user_id', user?.id)
        .lte('date', new Date().toISOString().split('T')[0])
        .gte('date', weightGoalData?.start_date ? weightGoalData.start_date : '2000-01-01')
        .order('weight', { ascending: false });
      console.log('Weight entries for loss calculation:', { 
        data: entries, 
        error: entriesError,
        goalStartDate: weightGoalData?.start_date,
        entriesCount: entries?.length
      });

      // Calculate weight lost (highest weight - current weight)
      const highestWeight = entries?.[0]?.weight;
      const weightLost = highestWeight && latestWeight?.weight ? 
        (highestWeight - latestWeight.weight).toFixed(1) : null;

      // For daily average, let's calculate average change per day
      // over the last 7 days with error checking
      const { data: recentEntries, error: recentError } = await supabase
        .from('weights')
        .select('weight, date')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(7);
      console.log('Recent entries query:', { data: recentEntries, error: recentError });

      let dailyAvg = 0;
      if (recentEntries && recentEntries.length > 1) {
        const weightChange = recentEntries[recentEntries.length - 1].weight - recentEntries[0].weight;
        const days = Math.ceil(
          (new Date(recentEntries[0].date).getTime() - 
           new Date(recentEntries[recentEntries.length - 1].date).getTime()) 
          / (1000 * 60 * 60 * 24)
        );
        dailyAvg = weightChange / days;
      }

      // Log the user ID and all calculated values
      console.log('Calculations:', {
        userId: user?.id,
        latestWeight: latestWeight?.weight,
        goalWeight: weightGoalData?.target_weight,
        highestWeight,
        weightLost,
        dailyAvg
      });

      setWeightGoal(weightGoalData || null);

      setStats({
        currentWeight: latestWeight?.weight || null,
        goalWeight: weightGoalData?.target_weight || null,
        weightLost: weightLost,
        dailyAverage: dailyAvg.toFixed(2),
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [user]);

  useEffect(() => {
    console.log('useEffect triggered', { user, refreshKey });
    if (user) {
      console.log('Fetching stats for user:', user.id);
      fetchStats();
    }
  }, [user, refreshKey, fetchStats]);

  useEffect(() => {
    setGoalWeight(stats.goalWeight);
    setTargetDate(weightGoal?.target_date || null);
  }, [stats.goalWeight, weightGoal?.target_date]);

  const handleWeightAdded = () => {
    console.log('Weight added, triggering refresh');
    setRefreshKey(prev => prev + 1);
    setIsModalOpen(false);
  };

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Sidebar */}
      <div className="drawer lg:drawer-open">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        
        {/* Drawer Content (main content) */}
        <div className="drawer-content">
          {/* Top Navigation */}
          <div className="navbar bg-base-100 lg:hidden">
            <div className="flex-none">
              <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost drawer-button">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-primary">DailyWeight</h1>
            </div>
            <div className="flex-none">
              <ThemeSwitcher />
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 lg:p-8 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card bg-primary/90 text-white">
                <div className="card-body">
                  <h2 className="card-title text-white/80">Current Weight</h2>
                  <p className="text-3xl font-bold text-white">
                    {stats.currentWeight ? `${stats.currentWeight} kg` : '-'}
                  </p>
                </div>
              </div>

              <div className="card bg-secondary/90 text-white">
                <div className="card-body">
                  <h2 className="card-title text-white/80">Goal Weight</h2>
                  <p className="text-3xl font-bold text-white">
                    {stats.goalWeight ? `${stats.goalWeight} kg` : '-'}
                  </p>
                </div>
              </div>

              <div className="card bg-accent/90 text-white">
                <div className="card-body">
                  <h2 className="card-title text-white/80">Weight Lost</h2>
                  <p className="text-3xl font-bold text-white">
                    {stats.weightLost ? `${stats.weightLost} kg` : '-'}
                  </p>
                </div>
              </div>

              <div className="card bg-neutral/90 text-white">
                <div className="card-body">
                  <h2 className="card-title text-white/80">Daily Average</h2>
                  <p className="text-3xl font-bold text-white">
                    {stats.dailyAverage ? `${stats.dailyAverage} kg` : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Section */}
              <div className="lg:col-span-2 space-y-8">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="card-title">Weight Progress</h2>
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary btn-sm text-white hover:bg-primary-focus"
                      >
                        Add Weight
                      </button>
                    </div>
                    <WeightChart 
                      key={`chart-${refreshKey}`} 
                      goalWeight={goalWeight} 
                      targetDate={targetDate}
                    />
                  </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title mb-4">AI Insights</h2>
                    <InsightCard />
                  </div>
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-8">
                <WeightGoalComponent />
                
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title mb-4">Recent Entries</h2>
                    <WeightEntries onDataChange={handleDataChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Side (menu) */}
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="menu p-4 w-80 min-h-full bg-base-100">
            {/* Sidebar content */}
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-8">
                <h1 className="text-xl font-bold text-primary">DailyWeight</h1>
                <ThemeSwitcher className="ml-auto" />
              </div>
              
              <ul className="menu menu-lg gap-2">
                <li>
                  <Link href="/account" className="text-base-content">
                    Account
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleSignOut}
                    className="text-base-content"
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <WeightEntryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWeightAdded={handleWeightAdded}
      />
    </div>
  );
}