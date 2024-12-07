export interface WeightEntry {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
  weight: number;
}

export interface WeightStatistics {
  id: string;
  user_id: string;
  entry_date: string;
  weight_change: number | null;
  rolling_average: number | null;
  created_at: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      weights: {
        Row: WeightEntry
        Insert: Omit<WeightEntry, 'id' | 'created_at'>
        Update: Partial<Omit<WeightEntry, 'id' | 'created_at'>>
      }
      weight_statistics: {
        Row: WeightStatistics
        Insert: Omit<WeightStatistics, 'id' | 'created_at'>
        Update: Partial<Omit<WeightStatistics, 'id' | 'created_at'>>
      }
    }
  }
}