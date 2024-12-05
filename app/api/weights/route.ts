import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { WeightEntry } from '@/types/database.types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const weightEntry: Omit<WeightEntry, 'id' | 'created_at'> = {
      user_id: body.user_id,
      date: body.date,
      weight: body.weight
    };

    const { data, error } = await supabase
      .from('weights')
      .insert([weightEntry])
      .select()
      .single();

    if (error) {
      console.error('Error adding weight entry:', error);
      return NextResponse.json(
        { error: 'Failed to add weight entry' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('weights')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching weights:', error);
      return NextResponse.json(
        { error: 'Failed to fetch weights' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}