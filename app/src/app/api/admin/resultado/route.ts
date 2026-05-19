import { NextRequest, NextResponse } from 'next/server';
import { splitPrize } from '@/lib/financial';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';
import { resultSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const admin = await assertAdmin(request.headers.get('authorization'));
    const input = resultSchema.parse(await request.json());
    const supabase = createServiceSupabaseClient();
    const { data: pool, error: poolError } = await supabase.from('pools').select('*').eq('id', input.pool_id).single();
    if (poolError || !pool) throw new Error('Bolão não encontrado.');
    await supabase.from('games').update({ result_home_score: input.home_score, result_away_score: input.away_score, status: 'finalizado' }).eq('id', pool.game_id);
    const { data: guesses } = await supabase.from('guesses').select('*').eq('pool_id', pool.id).eq('payment_status', 'approved');
    const paidGuesses = guesses ?? [];
    const winners = paidGuesses.filter((guess) => guess.home_score === input.home_score && guess.away_score === input.away_score);
    if (winners.length > 0) {
      const prizeShare = splitPrize(Number(pool.current_prize_amount), winners.length);
      await supabase.from('winners').delete().eq('pool_id', pool.id);
      await supabase.from('winners').insert(winners.map((guess) => ({ pool_id: pool.id, game_id: pool.game_id, guess_id: guess.id, prize_share: prizeShare })));
      await supabase.from('guesses').update({ status: 'perdedor' }).eq('pool_id', pool.id).eq('payment_status', 'approved');
      await supabase.from('guesses').update({ status: 'vencedor' }).in('id', winners.map((guess) => guess.id));
      await supabase.from('pools').update({ status: 'resultado_publicado', updated_at: new Date().toISOString() }).eq('id', pool.id);
    } else {
      await supabase.from('guesses').update({ status: 'perdedor' }).eq('pool_id', pool.id).eq('payment_status', 'approved');
      await supabase.from('pools').update({ status: 'sem_ganhadores', updated_at: new Date().toISOString() }).eq('id', pool.id);
    }
    await supabase.from('audit_logs').insert({ admin_user_id: admin.id, action: 'publish_result', entity_type: 'pool', entity_id: pool.id, metadata: input });
    return NextResponse.json({ winners_count: winners.length, status: winners.length ? 'resultado_publicado' : 'sem_ganhadores' });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao apurar resultado.' }, { status: 400 });
  }
}

