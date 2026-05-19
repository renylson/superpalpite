import { notFound } from 'next/navigation';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ListaPalpites } from '@/components/ListaPalpites';
import { PalpiteForm } from '@/components/PalpiteForm';
import { PremioAtual } from '@/components/PremioAtual';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { Pool, PublicPaidGuess } from '@/types';

async function getData(id: string): Promise<{ pool: Pool; guesses: PublicPaidGuess[] } | null> {
  try {
    const supabase = createServiceSupabaseClient();
    const [{ data: pool }, { data: guesses }] = await Promise.all([
      supabase.from('pools').select('*, games(*)').eq('id', id).single(),
      supabase.from('public_paid_guesses').select('*').eq('pool_id', id).order('paid_at', { ascending: false }),
    ]);
    if (!pool) return null;
    return { pool: pool as Pool, guesses: (guesses ?? []) as PublicPaidGuess[] };
  } catch {
    return null;
  }
}

export default async function PoolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getData(id);
  if (!data) notFound();
  const game = data.pool.games;
  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge>{data.pool.status}</Badge>
              <h1 className="mt-4 text-4xl font-black">{game?.home_team} x {game?.away_team}</h1>
              <p className="mt-2 text-zinc-300">{game?.competition || 'Futebol'} {game?.stadium ? `- ${game.stadium}` : ''}</p>
              {game?.match_date ? <p className="mt-2">Encerra em <CountdownTimer matchDate={game.match_date} /> - {formatDateTime(game.match_date)}</p> : null}
            </div>
            <div className="text-left lg:text-right">
              <p className="text-sm uppercase text-zinc-400">Prêmio atual</p>
              <PremioAtual poolId={data.pool.id} initialPrize={data.pool.current_prize_amount} />
            </div>
          </div>
        </Card>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><p className="text-zinc-400">Bilhete</p><strong>{formatCurrency(data.pool.ticket_amount)}</strong></Card>
          <Card><p className="text-zinc-400">Prêmio mínimo</p><strong>{formatCurrency(data.pool.minimum_prize_amount)}</strong></Card>
          <Card><p className="text-zinc-400">Confirmados</p><strong>{data.pool.paid_guesses_count}</strong></Card>
        </div>
        <ListaPalpites poolId={data.pool.id} initialGuesses={data.guesses} />
      </div>
      <aside>
        <PalpiteForm poolId={data.pool.id} />
      </aside>
    </section>
  );
}

