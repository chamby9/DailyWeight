export interface WeightGoal {
  id: string;
  target_weight: number;
  start_date: string;
  target_date: string | null;
  status: 'active' | 'achieved' | 'abandoned';
  notes: string | null;
} 