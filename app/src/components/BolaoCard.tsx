import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { TeamLogo } from '@/components/TeamLogo';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { Pool } from '@/types';

export function BolaoCard({ pool }: { pool: Pool }) {
  const game = pool.games;
  const isOpen = pool.status === 'aberto';
  const isClosed = pool.status === 'encerrado';

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-sp-dark shadow-sm transition hover:border-zinc-600 hover:shadow-lg">
      {/* Faixa palpites encerrados */}
      {isClosed && (
        <div className="bg-zinc-800/80 px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-zinc-400">
          🔒 Palpites encerrados
        </div>
      )}

      {/* Cabeçalho */}
      <div className="border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            {game?.competition || 'Futebol'}
          </p>
          {!isOpen && !isClosed && (
            <Badge className="border-zinc-700/50 bg-zinc-700/20 text-zinc-500">
              {pool.status}
            </Badge>
          )}
        </div>
      </div>

      {/* Times com logos */}
      <div className="px-4 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 flex-col items-center gap-2 text-center">
            <TeamLogo logo={game?.home_team_logo} name={game?.home_team || 'Casa'} size={48} />
            <p className="text-sm font-black leading-tight">{game?.home_team || 'Casa'}</p>
          </div>

          <div className="text-center">
            <span className="text-xs font-bold text-zinc-600">VS</span>
          </div>

          <div className="flex flex-1 flex-col items-center gap-2 text-center">
            <TeamLogo logo={game?.away_team_logo} name={game?.away_team || 'Visitante'} size={48} />
            <p className="text-sm font-black leading-tight">{game?.away_team || 'Visitante'}</p>
          </div>
        </div>

        {game?.match_date && (
          <p className="mt-3 text-center text-xs text-zinc-500">{formatDateTime(game.match_date)}</p>
        )}
      </div>

      {/* Prêmio em destaque */}
      <div className="border-y border-zinc-800 bg-sp-black/40 px-4 py-4 text-center">
        <p className="text-xs uppercase tracking-widest text-zinc-500">Prêmio atual</p>
        <p className="mt-1 text-3xl font-black text-sp-gold">{formatCurrency(pool.current_prize_amount)}</p>
      </div>

      {/* Rodapé */}
      <div className="mt-auto px-4 pb-4">
        <div className="my-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-zinc-800 bg-sp-black/40 p-3 text-center">
            <p className="text-xs text-zinc-500">Bilhete</p>
            <p className="mt-0.5 font-black">{formatCurrency(pool.ticket_amount)}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-sp-black/40 p-3 text-center">
            <p className="text-xs text-zinc-500">Confirmados</p>
            <p className="mt-0.5 font-black">{pool.paid_guesses_count}</p>
          </div>
        </div>

        {isOpen ? (
          <Link
            href={`/bolao/${pool.id}`}
            className="flex min-h-11 w-full items-center justify-center rounded-lg bg-sp-gold font-black text-sp-black transition hover:bg-sp-gold-dark"
          >
            ⚡ Participar agora
          </Link>
        ) : (
          <Link
            href={`/bolao/${pool.id}`}
            className="flex min-h-11 w-full items-center justify-center rounded-lg border border-zinc-700 bg-transparent font-black text-zinc-500 transition hover:border-zinc-500 hover:text-zinc-300"
          >
            Ver detalhes
          </Link>
        )}
      </div>
    </div>
  );
}
