import Link from 'next/link';
import { TeamLogo } from '@/components/TeamLogo';
import { formatCurrency } from '@/lib/utils';
import type { Pool } from '@/types';

const statusInfo: Record<string, { label: string; color: string }> = {
  resultado_publicado: { label: 'Prêmio Pago', color: 'text-emerald-400' },
  premio_pago: { label: 'Prêmio Pago', color: 'text-emerald-400' },
  sem_ganhadores: { label: 'Sem ganhadores', color: 'text-zinc-400' },
  aguardando_resultado: { label: 'Aguardando resultado', color: 'text-yellow-400' },
};

export function BolaoCardEncerrado({ pool }: { pool: Pool }) {
  const game = pool.games;
  const st = statusInfo[pool.status] ?? { label: pool.status, color: 'text-zinc-400' };
  const hasResult =
    game?.result_home_score !== null &&
    game?.result_home_score !== undefined &&
    game?.result_away_score !== null &&
    game?.result_away_score !== undefined;

  return (
    <Link href={`/bolao/${pool.id}`}>
      <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-sp-dark opacity-75 transition hover:border-zinc-600 hover:opacity-100">
        {/* Status */}
        <div className="border-b border-zinc-800 px-4 py-2 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            {game?.competition || 'Futebol'}
          </p>
        </div>

        {/* Times */}
        <div className="flex-1 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-1 flex-col items-center gap-2 text-center">
              <TeamLogo logo={game?.home_team_logo} name={game?.home_team || 'Casa'} size={40} />
              <p className="text-sm font-black leading-tight">{game?.home_team || 'Casa'}</p>
            </div>

            <div className="text-center">
              {hasResult ? (
                <div>
                  <p className="text-2xl font-black text-sp-gold">
                    {game!.result_home_score} × {game!.result_away_score}
                  </p>
                  <p className="text-xs text-zinc-600">placar final</p>
                </div>
              ) : (
                <span className="text-xs font-bold text-zinc-700">VS</span>
              )}
            </div>

            <div className="flex flex-1 flex-col items-center gap-2 text-center">
              <TeamLogo logo={game?.away_team_logo} name={game?.away_team || 'Visitante'} size={40} />
              <p className="text-sm font-black leading-tight">{game?.away_team || 'Visitante'}</p>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t border-zinc-800 bg-sp-black/40 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-xs font-bold ${st.color}`}>{st.label}</span>
            {pool.status !== 'sem_ganhadores' && (
              <span className="font-black text-sp-gold">{formatCurrency(pool.current_prize_amount)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
