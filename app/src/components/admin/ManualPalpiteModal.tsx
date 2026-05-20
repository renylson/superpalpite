'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

async function getToken() {
  const { data } = await createBrowserSupabaseClient().auth.getSession();
  return data.session?.access_token ?? '';
}

export function ManualPalpiteModal({ poolId, onClose, onSuccess }: {
  poolId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(formData: FormData) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/boloes/${poolId}/palpites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await getToken()}` },
        body: JSON.stringify({
          nome: formData.get('nome'),
          whatsapp: formData.get('whatsapp'),
          pix_key: formData.get('pix_key'),
          home_score: homeScore,
          away_score: awayScore,
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao adicionar palpite.');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro.');
    } finally {
      setLoading(false);
    }
  }

  function ScoreInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
    return (
      <div className="text-center">
        <p className="mb-2 text-xs font-bold uppercase text-zinc-500">{label}</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-lg font-black text-zinc-300 hover:border-zinc-500">−</button>
          <span className="w-8 text-center text-2xl font-black">{value}</span>
          <button type="button" onClick={() => onChange(Math.min(20, value + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-lg font-black text-zinc-300 hover:border-zinc-500">+</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md space-y-4 rounded-xl border border-zinc-700 bg-sp-dark p-6 shadow-2xl">
        <h3 className="text-xl font-black">Adicionar palpite manualmente</h3>
        <p className="text-sm text-zinc-500">O palpite será registrado como pago e confirmado.</p>

        <form action={submit} className="space-y-3">
          <div>
            <p className="mb-1 text-xs font-bold uppercase text-zinc-500">Nome completo</p>
            <input
              name="nome"
              required
              placeholder="Ex: João Silva"
              className="min-h-10 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-zinc-500">WhatsApp</p>
              <input
                name="whatsapp"
                required
                placeholder="11999999999"
                className="min-h-10 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold"
              />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-zinc-500">Chave Pix</p>
              <input
                name="pix_key"
                required
                placeholder="CPF, e-mail ou tel"
                className="min-h-10 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold"
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 rounded-xl border border-zinc-800 bg-sp-black/40 py-4">
            <ScoreInput label="Mandante" value={homeScore} onChange={setHomeScore} />
            <span className="text-xl font-black text-zinc-600">×</span>
            <ScoreInput label="Visitante" value={awayScore} onChange={setAwayScore} />
          </div>

          {error && (
            <p className="rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-200">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-sm font-bold text-zinc-300 hover:border-zinc-500">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 rounded-lg bg-sp-gold py-2.5 text-sm font-black text-sp-black hover:bg-sp-gold-dark disabled:opacity-60">
              {loading ? 'Salvando...' : 'Adicionar palpite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
