import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { Pool } from '@/types';

export function BolaoCard({ pool }: { pool: Pool }) {
  const game = pool.games;
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-400">{game?.competition || 'Futebol'}</p>
          <h2 className="mt-1 text-2xl font-black">{game?.home_team || 'Casa'} x {game?.away_team || 'Visitante'}</h2>
          {game?.match_date && <p className="mt-1 text-sm text-zinc-300">{formatDateTime(game.match_date)}</p>}
        </div>
        <Badge>{pool.status}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-sp-black p-3">
          <p className="text-zinc-400">Bilhete</p>
          <strong>{formatCurrency(pool.ticket_amount)}</strong>
        </div>
        <div className="rounded-md bg-sp-black p-3">
          <p className="text-zinc-400">Confirmados</p>
          <strong>{pool.paid_guesses_count}</strong>
        </div>
      </div>
      <div className="mt-auto">
        <p className="text-sm uppercase text-zinc-400">Prêmio atual</p>
        <p className="text-3xl font-black text-sp-gold">{formatCurrency(pool.current_prize_amount)}</p>
        <Link className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-sp-gold px-4 py-2 font-bold text-sp-black transition hover:bg-sp-gold-dark" href={`/bolao/${pool.id}`}>
          Participar
        </Link>
      </div>
    </Card>
  );
}

