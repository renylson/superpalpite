'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { formatDateTime } from '@/lib/utils';

type GameOption = {
  id: string;
  home_team: string;
  away_team: string;
  competition: string | null;
  match_date: string | null;
};

export function BolaoForm({ games }: { games: GameOption[] }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setError('');
    setLoading(true);
    try {
      const { data } = await createBrowserSupabaseClient().auth.getSession();
      const token = data.session?.access_token;
      const response = await fetch('/api/admin/boloes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token ?? ''}` },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Não foi possível salvar o bolão.');
      window.location.href = '/admin/boloes';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado ao salvar bolão.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={submit} className="grid gap-4">
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Jogo</p>
        <select
          className="min-h-11 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold"
          name="game_id"
          required
        >
          <option value="">Selecione um jogo...</option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.home_team} x {game.away_team}
              {game.competition ? ` — ${game.competition}` : ''}
              {game.match_date ? ` — ${formatDateTime(game.match_date)}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Valor do bilhete (R$)</p>
          <Input name="ticket_amount" type="number" step="0.01" min="0.01" placeholder="Ex: 10.00" required />
        </div>
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Taxa administrativa (%)</p>
          <Input name="admin_fee_percentage" type="number" step="0.01" min="0" max="100" defaultValue="40" />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-200">{error}</div>
      )}

      <Button disabled={loading || games.length === 0} className="w-full">
        {loading ? 'Publicando...' : 'Publicar bolão'}
      </Button>

      {games.length === 0 && (
        <p className="text-center text-sm text-zinc-500">Cadastre um jogo antes de criar um bolão.</p>
      )}
    </form>
  );
}
