import { notFound } from 'next/navigation';
import { BolaoActions } from '@/components/admin/BolaoActions';
import { BolaoDetalheClient } from '@/components/admin/BolaoDetalheClient';
import { FinancialSummary } from '@/components/admin/FinancialSummary';
import { Card } from '@/components/ui/Card';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { Guess, Pool } from '@/types';

export const dynamic = 'force-dynamic';

export default async function BolaoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let pool: Pool | null = null;
  let guesses: Guess[] = [];
  try {
    const supabase = createServiceSupabaseClient();
    const [{ data: poolData }, { data: guessData }] = await Promise.all([
      supabase.from('pools').select('*, games(*)').eq('id', id).single(),
      supabase.from('guesses').select('*').eq('pool_id', id).order('created_at', { ascending: false }),
    ]);
    pool = poolData as Pool;
    guesses = (guessData ?? []) as Guess[];
  } catch {}
  if (!pool) notFound();

  const game = pool.games;
  const canPublishResult = ['aberto', 'encerrado'].includes(pool.status);

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-2xl font-black">
          {game?.home_team ?? '?'} x {game?.away_team ?? '?'}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          {game?.competition ? `${game.competition} · ` : ''}
          {game?.match_date ? formatDateTime(game.match_date) : '—'}
        </p>
        <p className="mt-3 text-3xl font-black text-sp-gold">{formatCurrency(pool.current_prize_amount)}</p>
      </Card>

      <Card>
        <h3 className="mb-3 text-base font-black">Controles</h3>
        <BolaoActions pool={pool} />
      </Card>

      <BolaoDetalheClient poolId={pool.id} canPublishResult={canPublishResult} guesses={guesses} />

      <FinancialSummary
        total={pool.total_collected_amount}
        admin={pool.total_admin_fee_amount}
        prize={pool.total_prize_contribution_amount}
        paid={pool.paid_guesses_count}
      />
    </div>
  );
}
