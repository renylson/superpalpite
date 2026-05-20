'use client';

import { useRealtimePalpites } from '@/hooks/useRealtimePalpites';
import type { PublicPaidGuess } from '@/types';

export function ListaPalpites({ poolId, initialGuesses }: { poolId: string; initialGuesses: PublicPaidGuess[] }) {
  const guesses = useRealtimePalpites(poolId, initialGuesses);

  return (
    <div className="rounded-xl border border-zinc-800 bg-sp-dark overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <h2 className="font-black">Palpites confirmados</h2>
        <span className="rounded-full border border-emerald-700 bg-emerald-900/40 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
          {guesses.length} pagos
        </span>
      </div>

      {guesses.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <span className="text-3xl">🎯</span>
          <p className="mt-2 text-sm text-zinc-400">Nenhum palpite pago ainda.</p>
          <p className="mt-1 text-xs text-zinc-600">Seja o primeiro a participar!</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/60">
          {guesses.map((guess, index) => (
            <div
              key={guess.id}
              className="flex items-center gap-4 px-4 py-3 transition hover:bg-zinc-800/30"
            >
              <span className="w-5 shrink-0 text-center text-xs font-bold text-zinc-600">
                {index + 1}
              </span>
              <span className="flex-1 text-sm font-bold">{guess.public_name}</span>
              <div className="flex items-center gap-1">
                <span className="rounded-lg border border-zinc-700 bg-sp-black px-3 py-1 text-sm font-black text-sp-gold">
                  {guess.home_score} × {guess.away_score}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {guesses.length > 0 && (
        <div className="border-t border-zinc-800 px-4 py-2 text-center text-xs text-zinc-600">
          Atualizado em tempo real
        </div>
      )}
    </div>
  );
}
