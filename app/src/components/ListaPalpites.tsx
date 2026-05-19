'use client';

import { useRealtimePalpites } from '@/hooks/useRealtimePalpites';
import type { PublicPaidGuess } from '@/types';

export function ListaPalpites({ poolId, initialGuesses }: { poolId: string; initialGuesses: PublicPaidGuess[] }) {
  const guesses = useRealtimePalpites(poolId, initialGuesses);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">Palpites confirmados</h2>
        <span className="text-sm text-zinc-400">{guesses.length} pagos</span>
      </div>
      <div className="grid gap-2">
        {guesses.length === 0 ? (
          <p className="rounded-md bg-sp-dark p-4 text-zinc-400">Nenhum palpite pago ainda.</p>
        ) : guesses.map((guess) => (
          <div key={guess.id} className="flex items-center justify-between rounded-md bg-sp-dark px-4 py-3">
            <span className="font-bold">{guess.public_name}</span>
            <span className="text-sp-gold">{guess.home_score}x{guess.away_score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

