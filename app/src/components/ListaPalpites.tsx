'use client';

import { useRealtimePalpites } from '@/hooks/useRealtimePalpites';
import type { PublicPaidGuess } from '@/types';

export function ListaPalpites({
  poolId,
  initialGuesses,
  resultHomeScore,
  resultAwayScore,
}: {
  poolId: string;
  initialGuesses: PublicPaidGuess[];
  resultHomeScore?: number | null;
  resultAwayScore?: number | null;
}) {
  const guesses = useRealtimePalpites(poolId, initialGuesses);

  const hasResult =
    resultHomeScore !== null &&
    resultHomeScore !== undefined &&
    resultAwayScore !== null &&
    resultAwayScore !== undefined;

  function isWinner(g: PublicPaidGuess) {
    return hasResult &&
      g.home_score === resultHomeScore &&
      g.away_score === resultAwayScore;
  }

  const sorted = hasResult
    ? [...guesses].sort((a, b) => {
        const aW = isWinner(a) ? 0 : 1;
        const bW = isWinner(b) ? 0 : 1;
        return aW - bW;
      })
    : guesses;

  const winnersCount = hasResult ? sorted.filter(isWinner).length : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-sp-dark">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <h2 className="font-black">Palpites Registrados</h2>
        <span className="rounded-full border border-emerald-700 bg-emerald-900/40 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
          {guesses.length} pagos
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <span className="text-3xl">🎯</span>
          <p className="mt-2 text-sm text-zinc-400">Nenhum palpite pago ainda.</p>
          <p className="mt-1 text-xs text-zinc-600">Seja o primeiro a participar!</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/60">
          {hasResult && winnersCount > 0 && (
            <div className="bg-sp-gold/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-sp-gold">
              🏆 Vencedores — {winnersCount} acertou{winnersCount > 1 ? 'aram' : ''}
            </div>
          )}
          {sorted.map((guess, index) => {
            const winner = isWinner(guess);
            return (
              <div
                key={guess.id}
                className={`flex items-center gap-4 px-4 py-3 transition hover:bg-zinc-800/30 ${
                  winner ? 'bg-sp-gold/5' : ''
                }`}
              >
                <span className="w-5 shrink-0 text-center text-xs font-bold text-zinc-600">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm font-bold">
                  {guess.public_name}
                  {winner && <span className="ml-2 text-xs text-sp-gold">🏆</span>}
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className={`rounded-lg border px-3 py-1 text-sm font-black ${
                      winner
                        ? 'border-sp-gold/40 bg-sp-gold/10 text-sp-gold'
                        : 'border-zinc-700 bg-sp-black text-zinc-400'
                    }`}
                  >
                    {guess.home_score} × {guess.away_score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sorted.length > 0 && !hasResult && (
        <div className="border-t border-zinc-800 px-4 py-2 text-center text-xs text-zinc-600">
          Atualizado em tempo real
        </div>
      )}
    </div>
  );
}
