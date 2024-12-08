import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // First, get the entry we're about to delete
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: entryToDelete, error: fetchError } = await supabase
      .from('weights')
      .select('date')
      .eq('id', params.id)
      .single();

    if (fetchError || !entryToDelete) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    // Now deactivate existing statistics
    const { error: deactivateError } = await supabase
      .from('weight_statistics')
      .update({ active: false })
      .eq('user_id', session.user.id)
      .gte('entry_date', entryToDelete.date);

    if (deactivateError) {
      console.error('Error deactivating old statistics:', deactivateError);
      return NextResponse.json(
        { error: 'Failed to update statistics' },
        { status: 500 }
      );
    }

    // Delete the weight entry
    const { error: deleteError } = await supabase
      .from('weights')
      .delete()
      .eq('id', params.id)
      .eq('user_id', session.user.id);

    if (deleteError) {
      console.error('Error deleting weight entry:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete weight entry' },
        { status: 500 }
      );
    }

    // After deletion, recalculate statistics
    const { data: surroundingEntries } = await supabase
      .from('weights')
      .select('id, weight, date')
      .eq('user_id', session.user.id)
      .order('date', { ascending: true });

    if (surroundingEntries) {
      // For each entry that needs statistics updated
      for (const entry of surroundingEntries) {
        // Calculate weight change from previous entry
        const entryIndex = surroundingEntries.findIndex(e => e.id === entry.id);
        const previousEntry = entryIndex > 0 ? surroundingEntries[entryIndex - 1] : null;
        const weightChange = previousEntry 
          ? Number((entry.weight - previousEntry.weight).toFixed(1))
          : null;

        // Calculate 7-day rolling average
        const sixDaysAgo = new Date(entry.date);
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
        
        const weekEntries = surroundingEntries.filter(e => {
          const entryDate = new Date(e.date);
          return entryDate >= sixDaysAgo && entryDate <= new Date(entry.date);
        });

        const rollingAverage = weekEntries.length > 0
          ? Number((weekEntries.reduce((sum, e) => sum + e.weight, 0) / weekEntries.length).toFixed(1))
          : null;

        // Insert new active statistics record
        await supabase
          .from('weight_statistics')
          .upsert({
            user_id: session.user.id,
            entry_date: entry.date,
            weight_change: weightChange,
            rolling_average: rollingAverage,
            active: true
          });
      }
    }

    return NextResponse.json({ success: true });
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