'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export function BolaoForm({ games }: { games: { id: string; home_team: string; away_team: string }[] }) {
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
    <form action={submit} className="grid gap-3">
      <Input name="title" placeholder="Título do bolão" required />
      <select className="min-h-11 rounded-md border border-zinc-700 bg-sp-black px-3" name="game_id" required>
        {games.map((game) => <option key={game.id} value={game.id}>{game.home_team} x {game.away_team}</option>)}
      </select>
      <Input name="ticket_amount" type="number" step="0.01" placeholder="Valor do bilhete" required />
      <Input name="admin_fee_percentage" type="number" step="0.01" defaultValue="40" placeholder="Taxa administrativa %" />
      {error ? <p className="rounded-md bg-red-950 p-3 text-sm text-red-200">{error}</p> : null}
      <Button disabled={loading || games.length === 0}>{loading ? 'Publicando...' : 'Publicar bolão'}</Button>
    </form>
  );
}
