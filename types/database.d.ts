export interface Database {
  public: {
    Tables: {
      weights: {
        Row: {
          id: number
          user_id: string
          weight: number
          date: string
          created_at: string
        }
        Insert: Omit<Row, 'id' | 'created_at'>
        Update: Partial<Omit<Row, 'id' | 'created_at'>>
      }
    }
  }
}