'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

async function getToken() {
  const { data } = await createBrowserSupabaseClient().auth.getSession();
  return data.session?.access_token ?? '';
}

export function ResultadoModal({ poolId, onClose }: { poolId: string; onClose: () => void }) {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ winners_count: number; status: string } | null>(null);
  const [error, setError] = useState('');

  async function submit() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/resultado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await getToken()}` },
        body: JSON.stringify({ pool_id: poolId, home_score: homeScore, away_score: awayScore }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao apurar resultado.');
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro.');
    } finally {
      setLoading(false);
    }
  }

  function ScoreInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-lg font-black text-zinc-300 hover:border-zinc-500"
        >
          −
        </button>
        <span className="w-10 text-center text-3xl font-black">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(20, value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-lg font-black text-zinc-300 hover:border-zinc-500"
        >
          +
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-md space-y-5 rounded-xl border border-zinc-700 bg-sp-dark p-6 shadow-2xl text-center">
          <span className="text-5xl">{result.winners_count > 0 ? '🏆' : '😔'}</span>
          <h3 className="text-xl font-black">
            {result.winners_count > 0
              ? `${result.winners_count} vencedor${result.winners_count > 1 ? 'es' : ''} encontrado${result.winners_count > 1 ? 's' : ''}!`
              : 'Nenhum vencedor'}
          </h3>
          <p className="text-sm text-zinc-400">
            {result.winners_count > 0
              ? 'O prêmio foi dividido entre os acertadores. Bolão encerrado com resultado publicado.'
              : 'Nenhum palpite acertou o placar exato. Bolão encerrado sem ganhadores.'}
          </p>
          <button
            onClick={() => { onClose(); window.location.reload(); }}
            className="w-full rounded-lg bg-sp-gold py-2.5 font-black text-sp-black hover:bg-sp-gold-dark"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md space-y-5 rounded-xl border border-zinc-700 bg-sp-dark p-6 shadow-2xl">
        <h3 className="text-xl font-black">Encerrar bolão — Publicar resultado</h3>
        <p className="text-sm text-zinc-400">
          Informe o placar final do jogo. Os palpites que acertarem receberão o prêmio dividido.
        </p>

        <div className="flex items-center justify-center gap-6 rounded-xl border border-zinc-800 bg-sp-black/40 py-5">
          <div className="text-center">
            <p className="mb-2 text-xs font-bold uppercase text-zinc-500">Mandante</p>
            <ScoreInput value={homeScore} onChange={setHomeScore} />
          </div>
          <span className="text-2xl font-black text-zinc-600">×</span>
          <div className="text-center">
            <p className="mb-2 text-xs font-bold uppercase text-zinc-500">Visitante</p>
            <ScoreInput value={awayScore} onChange={setAwayScore} />
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-200">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-sm font-bold text-zinc-300 hover:border-zinc-500"
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 rounded-lg bg-sp-gold py-2.5 text-sm font-black text-sp-black hover:bg-sp-gold-dark disabled:opacity-60"
          >
            {loading ? 'Apurando...' : 'Confirmar placar'}
          </button>
        </div>
      </div>
    </div>
  );
}
