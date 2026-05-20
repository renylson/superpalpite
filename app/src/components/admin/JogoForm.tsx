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

function TeamField({ label, namePrefix, defaultName, defaultLogo }: {
  label: string;
  namePrefix: 'home' | 'away';
  defaultName?: string;
  defaultLogo?: string;
}) {
  const [logo, setLogo] = useState(defaultLogo ?? '');

  return (
    <div className="space-y-2 rounded-xl border border-zinc-800 bg-sp-black/40 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">{label}</p>

      <Input
        name={`${namePrefix}_team`}
        placeholder={`Nome do time (ex: ${namePrefix === 'home' ? 'Flamengo' : 'Palmeiras'})`}
        defaultValue={defaultName ?? ''}
        required
      />

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt="preview"
              className="h-10 w-10 rounded object-contain"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
          <Input
            name={`${namePrefix}_team_logo`}
            placeholder="URL do escudo (opcional)"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
          />
        </div>
        <p className="text-xs text-zinc-600">
          Encontre o escudo em{' '}
          <a
            href="https://football-logos.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sp-gold underline hover:text-sp-gold-dark"
          >
            football-logos.cc
          </a>
          {' '}→ abra o time → clique com botão direito na imagem → "Copiar endereço da imagem"
        </p>
      </div>
    </div>
  );
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
    <form action={submit} className="space-y-4">
      <TeamField
        label="Mandante (Casa)"
        namePrefix="home"
        defaultName={game?.home_team}
        defaultLogo={game?.home_team_logo ?? ''}
      />

      <TeamField
        label="Visitante (Fora)"
        namePrefix="away"
        defaultName={game?.away_team}
        defaultLogo={game?.away_team_logo ?? ''}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Competição</p>
          <Input name="competition" placeholder="Ex: Brasileirão Série A" defaultValue={game?.competition ?? ''} />
        </div>
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Estádio</p>
          <Input name="stadium" placeholder="Ex: Maracanã" defaultValue={game?.stadium ?? ''} />
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Data e horário</p>
        <Input name="match_date" type="datetime-local" defaultValue={toDateTimeLocal(game?.match_date)} required />
      </div>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-200">{error}</div>
      )}

      <Button disabled={loading} className="w-full">
        {loading ? 'Salvando...' : game ? 'Atualizar jogo' : 'Salvar jogo'}
      </Button>
    </form>
  );
}
