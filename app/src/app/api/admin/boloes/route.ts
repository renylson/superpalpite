import { NextRequest, NextResponse } from 'next/server';
import { calculateAdminFee, calculateMinimumPrize, calculatePrizeContribution } from '@/lib/financial';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';
import { poolSchema } from '@/lib/validators';

export async function GET() {
  const { data, error } = await createServiceSupabaseClient().from('pools').select('*, games(*)').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const admin = await assertAdmin(request.headers.get('authorization'));
    const input = poolSchema.parse(await request.json());
    const supabase = createServiceSupabaseClient();

    const { data: game } = await supabase
      .from('games')
      .select('home_team, away_team, competition')
      .eq('id', input.game_id)
      .single();

    const title = game
      ? `${game.home_team} x ${game.away_team}${game.competition ? ` — ${game.competition}` : ''}`
      : 'Bolão';

    const prizePercentage = 100 - input.admin_fee_percentage;
    const adminFee = calculateAdminFee(input.ticket_amount, input.admin_fee_percentage);
    const prizeContribution = calculatePrizeContribution(input.ticket_amount, prizePercentage);
    const minimumPrize = input.minimum_prize_override ?? calculateMinimumPrize(input.ticket_amount);
    const { minimum_prize_override: _override, ...insertInput } = input;

    const { data, error } = await supabase.from('pools').insert({
      ...insertInput,
      title,
      prize_percentage: prizePercentage,
      admin_fee_amount: adminFee,
      prize_contribution_amount: prizeContribution,
      minimum_prize_amount: minimumPrize,
      current_prize_amount: minimumPrize,
    }).select('*').single();
    if (error) throw error;
    await supabase.from('audit_logs').insert({ admin_user_id: admin.id, action: 'create_pool', entity_type: 'pool', entity_id: data.id });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao salvar bolão.' }, { status: 400 });
  }
}

