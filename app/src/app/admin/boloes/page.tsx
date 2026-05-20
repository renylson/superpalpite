import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { Pool } from '@/types';

export const dynamic = 'force-dynamic';

export default async function BoloesPage() {
  let pools: Pool[] = [];
  try {
    const { data } = await createServiceSupabaseClient()
      .from('pools')
      .select('*, games(*)')
      .order('created_at', { ascending: false });
    pools = (data ?? []) as Pool[];
  } catch {}

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Bolões</h1>
        <Link href="/admin/boloes/novo"><Button>Novo bolão</Button></Link>
      </div>

      {pools.length === 0 ? (
        <Card>
          <h2 className="text-xl font-black">Nenhum bolão cadastrado</h2>
          <p className="mt-2 text-zinc-400">Crie um bolão a partir de um jogo cadastrado para abrir a participação.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {pools.map((pool) => {
            const game = pool.games;
            const isActive = pool.is_active !== false;
            const isOpen = pool.status === 'aberto';
            return (
              <Link key={pool.id} href={`/admin/boloes/${pool.id}`}>
                <Card className="transition hover:border-sp-gold">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-black">
                        {game?.home_team ?? '?'} x {game?.away_team ?? '?'}
                      </h2>
                      <p className="mt-0.5 text-sm text-zinc-400">
                        {game?.competition ? `${game.competition} · ` : ''}
                        {game?.match_date ? formatDateTime(game.match_date) : '—'}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                        {isActive ? 'Ativo' : 'Inativo'}
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${isOpen ? 'bg-sp-gold/10 text-sp-gold' : 'bg-zinc-800 text-zinc-500'}`}>
                        {isOpen ? 'Palpites abertos' : 'Palpites fechados'}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-2xl font-black text-sp-gold">{formatCurrency(pool.current_prize_amount)}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{pool.paid_guesses_count} palpite(s) confirmado(s)</p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
