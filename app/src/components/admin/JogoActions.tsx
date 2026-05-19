'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export function JogoActions({ gameId }: { gameId: string }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function remove() {
    const confirmed = window.confirm('Tem certeza que deseja excluir este jogo? Esta ação não pode ser desfeita.');
    if (!confirmed) return;
    setError('');
    setLoading(true);
    try {
      const { data } = await createBrowserSupabaseClient().auth.getSession();
      const response = await fetch(`/api/admin/jogos/${gameId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${data.session?.access_token ?? ''}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Não foi possível excluir o jogo.');
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado ao excluir jogo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <Link href={`/admin/jogos/${gameId}`}>
        <Button type="button" variant="secondary">Editar</Button>
      </Link>
      <Button type="button" variant="danger" onClick={remove} disabled={loading}>
        {loading ? 'Excluindo...' : 'Excluir'}
      </Button>
      {error ? <p className="w-full rounded-md bg-red-950 p-3 text-sm text-red-200">{error}</p> : null}
    </div>
  );
}
