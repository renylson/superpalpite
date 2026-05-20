import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ListaPalpites } from '@/components/ListaPalpites';
import { PalpiteForm } from '@/components/PalpiteForm';
import { PremioAtual } from '@/components/PremioAtual';
import { TeamLogo } from '@/components/TeamLogo';
import { Badge } from '@/components/ui/Badge';
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

const statusLabel: Record<string, string> = {
  aberto: 'Aberto',
  encerrado: 'Encerrado',
  aguardando_resultado: 'Aguardando resultado',
  resultado_publicado: 'Resultado publicado',
  premio_pago: 'Prêmio pago',
  sem_ganhadores: 'Sem ganhadores',
  cancelado: 'Cancelado',
};

export default async function PoolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getData(id);
  if (!data) notFound();

  const game = data.pool.games;
  const isOpen = data.pool.status === 'aberto';
  const isResultPublished = ['resultado_publicado', 'premio_pago'].includes(data.pool.status);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-300">Início</Link>
        <span>/</span>
        <span className="text-zinc-300">{game?.home_team} x {game?.away_team}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Coluna principal */}
        <div className="space-y-5">
          {/* Card do jogo */}
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-sp-dark">
            <div className="border-b border-zinc-800 px-5 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                  {game?.competition || 'Futebol'}
                  {game?.stadium ? ` · ${game.stadium}` : ''}
                </p>
                <Badge>{statusLabel[data.pool.status] ?? data.pool.status}</Badge>
              </div>
            </div>

            <div className="px-5 py-6">
              {/* Times com logos */}
              <div className="flex items-center justify-between gap-6">
                <div className="flex flex-1 flex-col items-center gap-3 text-center">
                  <TeamLogo logo={game?.home_team_logo} name={game?.home_team || 'Casa'} size={64} />
                  <p className="text-xl font-black">{game?.home_team || 'Casa'}</p>
                </div>

                <div className="text-center">
                  {isResultPublished && game?.result_home_score !== null && game?.result_home_score !== undefined ? (
                    <div>
                      <p className="text-3xl font-black text-sp-gold">
                        {game.result_home_score} × {game.result_away_score}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">placar final</p>
                    </div>
                  ) : (
                    <span className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-black text-zinc-400">
                      VS
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col items-center gap-3 text-center">
                  <TeamLogo logo={game?.away_team_logo} name={game?.away_team || 'Visitante'} size={64} />
                  <p className="text-xl font-black">{game?.away_team || 'Visitante'}</p>
                </div>
              </div>

              {/* Data e countdown */}
              {game?.match_date && (
                <div className="mt-5 space-y-4 rounded-xl border border-zinc-800 bg-sp-black/40 p-5">
                  <p className="text-center text-sm text-zinc-400">{formatDateTime(game.match_date)}</p>
                  {isOpen && <CountdownTimer matchDate={game.match_date} />}
                </div>
              )}
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-sp-dark p-4 text-center">
              <p className="text-xs text-zinc-500">Valor do Palpite</p>
              <p className="mt-1 text-lg font-black">{formatCurrency(data.pool.ticket_amount)}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-sp-dark p-4 text-center">
              <p className="text-xs text-zinc-500">Palpites Registrados</p>
              <p className="mt-1 text-lg font-black">{data.pool.paid_guesses_count}</p>
            </div>
          </div>

          {/* Prêmio em destaque */}
          <div className="relative overflow-hidden rounded-xl border border-sp-gold/30 bg-sp-dark p-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,215,0,0.07),transparent_65%)]" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                {isResultPublished ? 'Valor do Prêmio Pago' : 'Valor do Prêmio Atual'}
              </p>
              <div className="mt-2">
                <PremioAtual poolId={data.pool.id} initialPrize={data.pool.current_prize_amount} />
              </div>
              {!isResultPublished && (
                <>
                  <p className="mt-3 text-sm font-bold text-zinc-300">
                    Acerte o placar exato e leve o prêmio! 🏆
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    O prêmio é dividido igualmente entre todos que acertarem.
                  </p>
                </>
              )}
              {isResultPublished && (
                <p className="mt-3 text-xs text-zinc-500">
                  O prêmio foi dividido entre os acertadores do placar exato.
                </p>
              )}
            </div>
          </div>

          {/* Lista de palpites */}
          <ListaPalpites
            poolId={data.pool.id}
            initialGuesses={data.guesses}
            resultHomeScore={game?.result_home_score}
            resultAwayScore={game?.result_away_score}
          />
        </div>

        {/* Sidebar — formulário */}
        <aside className="space-y-4">
          {isOpen ? (
            <PalpiteForm
              poolId={data.pool.id}
              homeTeam={game?.home_team}
              awayTeam={game?.away_team}
            />
          ) : (
            <div className="rounded-xl border border-zinc-700 bg-sp-dark p-5 text-center">
              <span className="text-4xl">🔒</span>
              <h3 className="mt-3 font-black">Palpites encerrados</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Este bolão não está mais aceitando palpites.
              </p>
              <Link href="/" className="mt-4 inline-block text-sm text-sp-gold hover:underline">
                Ver outros jogos
              </Link>
            </div>
          )}

          <div className="rounded-xl border border-zinc-800 bg-sp-dark p-4 text-sm text-zinc-400">
            <p className="font-bold text-zinc-300">Como funciona:</p>
            <ol className="mt-2 list-inside list-decimal space-y-1.5">
              <li>Escolha o placar que você acha que vai sair</li>
              <li>Informe seus dados e a chave Pix</li>
              <li>Pague o Pix dentro do prazo</li>
              <li>Se acertar o placar exato, recebe o prêmio</li>
            </ol>
            <Link href="/regulamento" className="mt-3 block text-sp-gold hover:underline">
              Ler regulamento completo →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
