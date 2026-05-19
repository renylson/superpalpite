'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { Game } from '@/types';

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return '';
  const date = new Date(value);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 16);
}

export function JogoForm({ game }: { game?: Game }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setError('');
    setLoading(true);
    try {
      const { data } = await createBrowserSupabaseClient().auth.getSession();
      const token = data.session?.access_token;
      const response = await fetch(game ? `/api/admin/jogos/${game.id}` : '/api/admin/jogos', {
        method: game ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token ?? ''}` },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Não foi possível salvar o jogo.');
      window.location.href = '/admin/jogos';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado ao salvar jogo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={submit} className="grid gap-3">
      <Input name="home_team" placeholder="Mandante" defaultValue={game?.home_team ?? ''} required />
      <Input name="away_team" placeholder="Visitante" defaultValue={game?.away_team ?? ''} required />
      <Input name="competition" placeholder="Competição" defaultValue={game?.competition ?? ''} />
      <Input name="stadium" placeholder="Estádio" defaultValue={game?.stadium ?? ''} />
      <Input name="match_date" type="datetime-local" defaultValue={toDateTimeLocal(game?.match_date)} required />
      <select className="min-h-11 rounded-md border border-zinc-700 bg-sp-black px-3" name="status" defaultValue={game?.status ?? 'agendado'}>
        <option value="agendado">Agendado</option>
        <option value="em_andamento">Em andamento</option>
        <option value="finalizado">Finalizado</option>
        <option value="cancelado">Cancelado</option>
      </select>
      {error ? <p className="rounded-md bg-red-950 p-3 text-sm text-red-200">{error}</p> : null}
      <Button disabled={loading}>{loading ? 'Salvando...' : game ? 'Atualizar jogo' : 'Salvar jogo'}</Button>
    </form>
  );
}
