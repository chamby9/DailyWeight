import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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

    // Get all weight entries
    const { data: weightEntries, error: weightError } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: true });

    if (weightError) {
      throw weightError;
    }

    // Get latest statistics
    const { data: latestStats, error: statsError } = await supabase
      .from('weight_statistics')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('active', true)
      .order('entry_date', { ascending: false })
      .limit(1)
      .single();

    if (statsError && statsError.code !== 'PGRST116') { // Ignore "no rows returned" error
      throw statsError;
    }

    // Get current active goal
    const { data: currentGoal, error: goalError } = await supabase
      .from('weight_goals')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (goalError && goalError.code !== 'PGRST116') { // Ignore "no rows returned" error
      throw goalError;
    }

    // Create timestamp for the export
    const exportTimestamp = new Date().toISOString();

    // Construct the user data package
    const userDataPackage = {
      exportDate: exportTimestamp,
      userData: {
        userId: session.user.id,
        email: session.user.email,
      },
      weightEntries: weightEntries || [],
      currentStatistics: latestStats || null,
      currentGoal: currentGoal || null,
      metadata: {
        totalEntries: weightEntries?.length || 0,
        firstEntry: weightEntries?.[0]?.date || null,
        lastEntry: weightEntries?.[weightEntries.length - 1]?.date || null,
        hasActiveGoal: !!currentGoal,
      }
    };

    // Store the export record
    const { error: exportError } = await supabase
      .from('user_data_exports')
      .insert([{
        user_id: session.user.id,
        export_date: exportTimestamp,
        data: userDataPackage
      }]);

    if (exportError) {
      console.error('Failed to store export record:', exportError);
      // Continue anyway as this is not critical
    }

    return NextResponse.json(userDataPackage);
  } catch (error) {
    console.error('Error packaging user data:', error);
    return NextResponse.json(
      { error: 'Failed to package user data' },
      { status: 500 }
    );
  }
} 