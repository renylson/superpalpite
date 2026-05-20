'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { Guess } from '@/types';

async function getToken() {
  const { data } = await createBrowserSupabaseClient().auth.getSession();
  return data.session?.access_token ?? '';
}

const paymentLabel: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  expired: 'Expirado',
  canceled: 'Cancelado',
  refunded: 'Reembolsado',
};

const statusLabel: Record<string, { label: string; color: string }> = {
  aguardando_pagamento: { label: 'Aguard. pgto', color: 'text-zinc-400' },
  pago_valido: { label: 'Pago', color: 'text-emerald-400' },
  expirado: { label: 'Expirado', color: 'text-zinc-500' },
  cancelado: { label: 'Cancelado', color: 'text-zinc-500' },
  vencedor: { label: '🏆 Vencedor', color: 'text-sp-gold font-black' },
  perdedor: { label: 'Perdedor', color: 'text-zinc-500' },
};

export function PalpitesTable({ guesses: initial }: { guesses: Guess[] }) {
  const [guesses, setGuesses] = useState(initial);
  const [confirmDelete, setConfirmDelete] = useState<Guess | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  async function deleteGuess() {
    if (!confirmDelete) return;
    setDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch(`/api/admin/guesses/${confirmDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao remover.');
      setGuesses((prev) => prev.filter((g) => g.id !== confirmDelete.id));
      setConfirmDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro.');
    } finally {
      setDeleting(false);
    }
  }

  if (guesses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 py-10 text-center text-zinc-500">
        Nenhum palpite registrado ainda.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-sp-black/60 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Placar</th>
              <th className="px-4 py-3">Origem</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Pagamento</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {guesses.map((guess) => {
              const st = statusLabel[guess.status] ?? { label: guess.status, color: 'text-zinc-400' };
              return (
                <tr key={guess.id} className="border-t border-zinc-800 hover:bg-sp-black/30">
                  <td className="px-4 py-3 font-bold">{guess.nome}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-zinc-800 px-2 py-0.5 font-black">
                      {guess.home_score} × {guess.away_score}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {guess.mercado_pago_payment_id ? (
                      <span className="rounded-full bg-blue-950/50 px-2 py-0.5 text-xs font-bold text-blue-400">Pix</span>
                    ) : (
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-bold text-zinc-400">Manual</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{guess.whatsapp}</td>
                  <td className="px-4 py-3 text-zinc-400">{paymentLabel[guess.payment_status] ?? guess.payment_status}</td>
                  <td className={`px-4 py-3 ${st.color}`}>{st.label}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(guess.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setDeleteError(''); setConfirmDelete(guess); }}
                      className="rounded px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-950/30 hover:text-red-400"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md space-y-4 rounded-xl border border-zinc-700 bg-sp-dark p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none">⚠️</span>
              <div>
                <h3 className="font-black text-red-400">Remover palpite?</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  O palpite de <strong className="text-zinc-200">{confirmDelete.nome}</strong> (
                  {confirmDelete.home_score} × {confirmDelete.away_score}) será excluído e os financeiros do bolão serão recalculados.
                </p>
              </div>
            </div>
            {deleteError && (
              <p className="rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-200">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-sm font-bold text-zinc-300 hover:border-zinc-500">
                Cancelar
              </button>
              <button onClick={deleteGuess} disabled={deleting}
                className="flex-1 rounded-lg bg-red-700 py-2.5 text-sm font-black text-white hover:bg-red-600 disabled:opacity-60">
                {deleting ? 'Removendo...' : 'Sim, remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
