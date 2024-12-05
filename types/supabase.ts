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
      weight_entries: {
        Row: {
          id: string
          created_at: string
          user_id: string
          weight: number
          note: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          weight: number
          note?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          weight?: number
          note?: string | null
        }
      }
    }
  }
}