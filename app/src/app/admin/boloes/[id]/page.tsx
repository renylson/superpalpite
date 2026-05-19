import { notFound } from 'next/navigation';
import { FinancialSummary } from '@/components/admin/FinancialSummary';
import { ExportButton } from '@/components/admin/ExportButton';
import { PalpitesTable } from '@/components/admin/PalpitesTable';
import { Card } from '@/components/ui/Card';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';
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
  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-2xl font-black">{pool.title}</h2>
        <p className="text-zinc-400">{pool.games?.home_team} x {pool.games?.away_team} - {pool.status}</p>
        <p className="mt-2 text-3xl font-black text-sp-gold">{formatCurrency(pool.current_prize_amount)}</p>
      </Card>
      <FinancialSummary total={pool.total_collected_amount} admin={pool.total_admin_fee_amount} prize={pool.total_prize_contribution_amount} paid={pool.paid_guesses_count} />
      <Card>
        <h3 className="mb-3 text-xl font-black">Ações</h3>
        <div className="flex flex-wrap gap-3">
          <ExportButton poolId={pool.id} />
        </div>
      </Card>
      <PalpitesTable guesses={guesses} />
    </div>
  );
}
