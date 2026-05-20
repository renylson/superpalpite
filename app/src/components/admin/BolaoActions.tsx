'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { Pool } from '@/types';

async function getToken() {
  const { data } = await createBrowserSupabaseClient().auth.getSession();
  return data.session?.access_token ?? '';
}

async function patchPool(id: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/admin/boloes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await getToken()}` },
    body: JSON.stringify(body),
  });
  const payload = await res.json();
  if (!res.ok) throw new Error(payload.error || 'Erro ao atualizar bolão.');
  return payload;
}

function Toggle({
  checked,
  onChange,
  disabled,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-sp-black/40 px-4 py-3 text-left transition hover:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div>
        <p className="text-sm font-bold text-zinc-200">{label}</p>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <div
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-emerald-500' : 'bg-zinc-700'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
    </button>
  );
}

export function BolaoActions({ pool }: { pool: Pool }) {
  const router = useRouter();
  const [loadingActive, setLoadingActive] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isActive = pool.is_active !== false;
  const isGuessesOpen = pool.status === 'aberto';
  const canToggleGuesses = pool.status === 'aberto' || pool.status === 'encerrado';

  function showSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  }

  async function toggleActive() {
    setLoadingActive(true);
    setError('');
    try {
      await patchPool(pool.id, { is_active: !isActive });
      showSuccess(isActive ? 'Bolão ocultado do site.' : 'Bolão visível no site.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro.');
    } finally {
      setLoadingActive(false);
    }
  }

  async function toggleStatus() {
    setLoadingStatus(true);
    setError('');
    try {
      await patchPool(pool.id, { status: isGuessesOpen ? 'encerrado' : 'aberto' });
      showSuccess(isGuessesOpen ? 'Palpites encerrados.' : 'Palpites abertos.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro.');
    } finally {
      setLoadingStatus(false);
    }
  }

  async function deletePool() {
    setLoadingDelete(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/boloes/${pool.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao excluir.');
      window.location.href = '/admin/boloes';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro.');
      setLoadingDelete(false);
      setDeleteModal(false);
    }
  }

  return (
    <>
      <div className="space-y-3">
        <Toggle
          checked={isActive}
          onChange={toggleActive}
          disabled={loadingActive}
          label={isActive ? 'Visível no site' : 'Oculto no site'}
          description={
            isActive
              ? 'Este bolão aparece na página pública.'
              : 'Este bolão está oculto — somente admins podem vê-lo.'
          }
        />

        {canToggleGuesses && (
          <Toggle
            checked={isGuessesOpen}
            onChange={toggleStatus}
            disabled={loadingStatus}
            label={isGuessesOpen ? 'Palpites abertos' : 'Palpites fechados'}
            description={
              isGuessesOpen
                ? 'Participantes podem enviar palpites.'
                : 'Nenhum novo palpite será aceito.'
            }
          />
        )}

        {!canToggleGuesses && (
          <div className="rounded-xl border border-zinc-800 bg-sp-black/40 px-4 py-3">
            <p className="text-sm font-bold text-zinc-400">Status: {pool.status}</p>
            <p className="text-xs text-zinc-600">Fase avançada — altere via painel de resultados.</p>
          </div>
        )}

        <div className="pt-1">
          <button
            onClick={() => setDeleteModal(true)}
            className="w-full rounded-xl border border-red-900/60 py-2.5 text-sm font-bold text-red-500 transition hover:border-red-700 hover:bg-red-950/30"
          >
            Excluir bolão
          </button>
        </div>
      </div>

      {success && (
        <p className="mt-3 rounded-lg border border-emerald-800 bg-emerald-950/50 px-3 py-2 text-sm font-bold text-emerald-400">
          ✓ {success}
        </p>
      )}
      {error && (
        <p className="mt-3 rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-200">{error}</p>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md space-y-5 rounded-xl border border-zinc-700 bg-sp-dark p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none">⚠️</span>
              <div>
                <h3 className="text-lg font-black text-red-400">Excluir bolão permanentemente?</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Esta ação <strong className="text-zinc-200">não pode ser desfeita</strong>. Todos os
                  palpites e dados financeiros vinculados serão excluídos junto com o bolão.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-sm font-bold text-zinc-300 transition hover:border-zinc-500"
              >
                Cancelar
              </button>
              <button
                onClick={deletePool}
                disabled={loadingDelete}
                className="flex-1 rounded-lg bg-red-700 py-2.5 text-sm font-black text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                {loadingDelete ? 'Excluindo...' : 'Sim, excluir tudo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
