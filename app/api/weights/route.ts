import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    console.log('🏁 Starting weight entry process...');
    
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.log('❌ No session found - unauthorized');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userId = session.user.id;
    const newWeight = body.weight;
    const entryDate = body.date;

    console.log('📥 New entry details:', {
      userId,
      newWeight,
      entryDate
    });

    // Start a transaction
    const { data: weightEntry, error: weightError } = await supabase
      .from('weights')
      .insert([{
        user_id: userId,
        date: entryDate,
        weight: newWeight
      }])
      .select()
      .single();

    if (weightError) {
      console.error('❌ Error adding weight entry:', weightError);
      return NextResponse.json(
        { error: 'Failed to add weight entry' },
        { status: 500 }
      );
    }

    console.log('✅ Weight entry added successfully:', weightEntry);

    // Get the previous weight entry
    const { data: previousEntry } = await supabase
      .from('weights')
      .select('weight, date')
      .eq('user_id', userId)
      .lt('date', entryDate)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    console.log('🔍 Previous entry found:', previousEntry);

    // Calculate weight change
    const weightChange = previousEntry 
      ? Number((newWeight - previousEntry.weight).toFixed(1))
      : null;

    console.log('📊 Weight change calculation:', {
      previousWeight: previousEntry?.weight,
      newWeight,
      weightChange,
    });

    // Calculate 7-day rolling average (current day + previous 6 days)
    const sixDaysAgo = new Date(entryDate);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    console.log('📅 Calculating average from:', {
      start: sixDaysAgo.toISOString().split('T')[0],
      end: entryDate,
      explanation: '7-day window (today plus previous 6 days)'
    });

    const { data: weekEntries } = await supabase
      .from('weights')
      .select('weight, date')
      .eq('user_id', userId)
      .gte('date', sixDaysAgo.toISOString().split('T')[0])
      .lte('date', entryDate)
      .order('date', { ascending: true });

    console.log('📊 Week entries found:', weekEntries?.map(entry => ({
      date: entry.date,
      weight: entry.weight,
      daysFromToday: Math.round((new Date(entryDate).getTime() - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24))
    })));

    let rollingAverage = null;
    if (weekEntries && weekEntries.length > 0) {
      const sum = weekEntries.reduce((acc, entry) => acc + entry.weight, 0);
      rollingAverage = Number((sum / weekEntries.length).toFixed(1));
      
      console.log('📊 Rolling average calculation:', {
        numberOfEntries: weekEntries.length,
        sum: sum,
        average: rollingAverage
      });
    } else {
      console.log('ℹ️ Not enough entries for rolling average');
    }

    // Store statistics
    const { data: statsEntry, error: statsError } = await supabase
      .from('weight_statistics')
      .insert([{
        user_id: userId,
        entry_date: entryDate,
        weight_change: weightChange,
        rolling_average: rollingAverage
      }])
      .select()
      .single();

    if (statsError) {
      console.error('⚠️ Error adding weight statistics:', statsError);
    } else {
      console.log('✅ Statistics stored successfully:', statsEntry);
    }

    console.log('🏁 Weight entry process completed');
    return NextResponse.json(weightEntry);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false });

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