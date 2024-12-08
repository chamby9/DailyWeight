import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

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

    // Check if we already have an insight for today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingInsight } = await supabase
      .from('weight_insights')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('generated_at', today)
      .lt('generated_at', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString())
      .single();

    if (existingInsight) {
      return NextResponse.json(existingInsight);
    }

    // If no insight for today, get the most recent insight
    const { data: latestInsight } = await supabase
      .from('weight_insights')
      .select('*')
      .eq('user_id', session.user.id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (latestInsight) {
      return NextResponse.json(latestInsight);
    }

    // Check if user has added weight entry today
    const { data: todayWeight } = await supabase
      .from('weights')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('date', today)
      .single();

    if (todayWeight) {
      // Instead of fetching from the API, let's get the data directly from Supabase
      const [weightEntries, latestStats, currentGoal] = await Promise.all([
        supabase
          .from('weights')
          .select('*')
          .eq('user_id', session.user.id)
          .order('date', { ascending: true }),
        supabase
          .from('weight_statistics')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('active', true)
          .order('entry_date', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('weight_goals')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .single()
      ]);

      const userData = {
        weightEntries: weightEntries.data || [],
        currentStatistics: latestStats.data || null,
        currentGoal: currentGoal.data || null,
        metadata: {
          totalEntries: weightEntries.data?.length || 0,
          firstEntry: weightEntries.data?.[0]?.date || null,
          lastEntry: weightEntries.data?.[weightEntries.data.length - 1]?.date || null,
          hasActiveGoal: !!currentGoal.data
        }
      };

      // Prepare the prompt
      const prompt = `As a weight tracking assistant, analyze this user's weight data and provide a helpful insight. Here's their data:

Current Goal: ${userData.currentGoal ? `${userData.currentGoal.target_weight}kg by ${userData.currentGoal.target_date}` : 'No goal set'}

Weight Entries: ${JSON.stringify(userData.weightEntries.slice(-10))} // Last 10 entries

Statistics:
- Total Entries: ${userData.metadata.totalEntries}
- First Entry Date: ${userData.metadata.firstEntry}
- Latest Entry Date: ${userData.metadata.lastEntry}
- Latest Statistics: ${JSON.stringify(userData.currentStatistics)}

Previous Insight: ${latestInsight?.insight || 'No previous insight'}

Please provide a new, unique insight about their progress that focuses on different aspects than the previous insight. Include:
1. Recent trends
2. Progress towards their goal (if set)
3. One actionable suggestion
4. Any patterns noticed (if applicable)

Important: Ensure your response offers a fresh perspective and doesn't repeat the same points as the previous insight.
Keep the response under 150 words and focus on being helpful and motivational.`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });

      const insight = completion.choices[0].message.content;

      // Store the insight in Supabase
      const generatedAt = new Date().toISOString();
      console.log('Generated insight timestamp:', generatedAt);

      const { error: insertError } = await supabase
        .from('weight_insights')
        .insert([{
          user_id: session.user.id,
          insight,
          generated_at: generatedAt,
        }]);

      if (insertError) {
        console.error('Error storing insight:', insertError);
      }

      return NextResponse.json({ 
        insight,
        generated_at: generatedAt
      });
    } else {
      // No insight exists at all and no weight entry for today
      return NextResponse.json(null);
    }

  } catch (error) {
    console.error('Error in insights route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insight' },
      { status: 500 }
    );
  }
} 