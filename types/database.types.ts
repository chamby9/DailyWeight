export interface WeightEntry {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
  weight: number;
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
    }
  }
}