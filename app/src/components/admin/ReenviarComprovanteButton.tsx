'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

async function getToken() {
  const { data } = await createBrowserSupabaseClient().auth.getSession();
  return data.session?.access_token ?? '';
}

export function ReenviarComprovanteButton({ guessId, email }: { guessId: string; email: string | null }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function reenviar() {
    setLoading(true);
    setStatus('idle');
    try {
      const res = await fetch(`/api/admin/guesses/${guessId}/comprovante`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao reenviar.');
      setStatus('ok');
      setMsg(`Enviado para ${data.email}`);
    } catch (err) {
      setStatus('error');
      setMsg(err instanceof Error ? err.message : 'Erro.');
    } finally {
      setLoading(false);
    }
  }

  if (!email) {
    return <span className="text-xs text-zinc-600">Sem e-mail</span>;
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={reenviar}
        disabled={loading}
        className="rounded-lg border border-zinc-700 px-3 py-1 text-xs font-bold text-zinc-300 transition hover:border-sp-gold hover:text-sp-gold disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Reenviar'}
      </button>
      {status === 'ok' && <span className="text-xs text-emerald-400">✓ {msg}</span>}
      {status === 'error' && <span className="text-xs text-red-400">{msg}</span>}
    </div>
  );
}
