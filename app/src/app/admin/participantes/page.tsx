'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { formatCPF, formatPhone } from '@/lib/masks';

type Participant = {
  cpf: string;
  nome: string;
  whatsapp: string;
  email: string;
  pix_type: string;
  pix_key: string;
  created_at: string;
  updated_at: string;
};

async function getToken() {
  const { data } = await createBrowserSupabaseClient().auth.getSession();
  return data.session?.access_token ?? '';
}

const PIX_LABELS: Record<string, string> = { email: 'E-mail', cpf: 'CPF', telefone: 'Telefone' };

export default function ParticipantesPage() {
  const [list, setList] = useState<Participant[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState<Participant | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Participant | null>(null);
  const [editForm, setEditForm] = useState({ nome: '', whatsapp: '', email: '', pix_type: '', pix_key: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const token = await getToken();
      const url = q ? `/api/admin/participantes?q=${encodeURIComponent(q)}` : '/api/admin/participantes';
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch { setList([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const timer = setTimeout(() => load(search), 350);
    return () => clearTimeout(timer);
  }, [search, load]);

  function openEdit(p: Participant) {
    setEditForm({ nome: p.nome, whatsapp: formatPhone(p.whatsapp), email: p.email, pix_type: p.pix_type, pix_key: p.pix_key });
    setEditModal(p);
    setError('');
  }

  async function saveEdit() {
    if (!editModal) return;
    setSaving(true); setError('');
    try {
      const res = await fetch(`/api/admin/participantes/${editModal.cpf}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await getToken()}` },
        body: JSON.stringify({
          nome: editForm.nome,
          whatsapp: editForm.whatsapp.replace(/\D/g, ''),
          email: editForm.email,
          pix_type: editForm.pix_type,
          pix_key: editForm.pix_key,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditModal(null);
      setSuccess('Cadastro atualizado.');
      setTimeout(() => setSuccess(''), 3000);
      load(search);
    } catch (err) { setError(err instanceof Error ? err.message : 'Erro.'); }
    finally { setSaving(false); }
  }

  async function remove() {
    if (!deleteConfirm) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/participantes/${deleteConfirm.cpf}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setDeleteConfirm(null);
      load(search);
    } catch (err) { alert(err instanceof Error ? err.message : 'Erro.'); }
    finally { setSaving(false); }
  }

  function exportCSV() {
    const header = ['CPF', 'Nome', 'WhatsApp', 'E-mail', 'Tipo Pix', 'Chave Pix', 'Cadastro'];
    const rows = list.map(p => [
      formatCPF(p.cpf), p.nome, formatPhone(p.whatsapp), p.email,
      PIX_LABELS[p.pix_type] ?? p.pix_type, p.pix_key,
      new Date(p.created_at).toLocaleDateString('pt-BR'),
    ]);
    const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `participantes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">Cadastros de Usuários</h1>
          <p className="mt-0.5 text-sm text-zinc-400">{list.length} participante{list.length !== 1 ? 's' : ''} encontrado{list.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={exportCSV}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-sp-gold hover:text-sp-gold">
          Exportar CSV
        </button>
      </div>

      {/* Busca */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar por nome, CPF ou e-mail..."
        className="min-h-11 w-full rounded-xl border border-zinc-700 bg-sp-black px-4 text-sm text-sp-white outline-none focus:border-sp-gold"
      />

      {success && <p className="rounded-lg border border-emerald-800 bg-emerald-950/50 px-3 py-2 text-sm font-bold text-emerald-400">✓ {success}</p>}

      {/* Tabela */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-sp-black/60 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">CPF</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Chave Pix</th>
              <th className="px-4 py-3">Cadastro</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-500">Carregando...</td></tr>
            )}
            {!loading && list.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-500">Nenhum participante encontrado.</td></tr>
            )}
            {list.map(p => (
              <tr key={p.cpf} className="border-t border-zinc-800 hover:bg-sp-black/30">
                <td className="px-4 py-3 font-bold">{p.nome}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{formatCPF(p.cpf)}</td>
                <td className="px-4 py-3 text-zinc-400">{p.email}</td>
                <td className="px-4 py-3 text-zinc-400">{formatPhone(p.whatsapp)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs text-zinc-500">{PIX_LABELS[p.pix_type] ?? p.pix_type}</span>
                  <span className="ml-2 text-xs text-zinc-300">{p.pix_key}</span>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">
                  {new Date(p.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(p)} className="text-xs font-bold text-sp-gold hover:underline">Editar</button>
                    <button onClick={() => setDeleteConfirm(p)} className="text-xs font-bold text-red-400 hover:underline">Remover</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal edição */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md space-y-4 rounded-xl border border-zinc-700 bg-sp-dark p-6 shadow-2xl">
            <div>
              <h3 className="text-xl font-black">Editar cadastro</h3>
              <p className="mt-0.5 text-xs text-zinc-500">CPF: {formatCPF(editModal.cpf)} — não pode ser alterado</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Nome completo', key: 'nome', type: 'text' },
                { label: 'WhatsApp', key: 'whatsapp', type: 'tel' },
                { label: 'E-mail', key: 'email', type: 'email' },
                { label: 'Chave Pix', key: 'pix_key', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <p className="mb-1 text-xs font-bold uppercase text-zinc-500">{label}</p>
                  <input type={type} value={editForm[key as keyof typeof editForm]}
                    onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                    className="min-h-10 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold" />
                </div>
              ))}
              <div>
                <p className="mb-1 text-xs font-bold uppercase text-zinc-500">Tipo de chave Pix</p>
                <select value={editForm.pix_type} onChange={e => setEditForm(f => ({ ...f, pix_type: e.target.value }))}
                  className="min-h-10 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold">
                  <option value="cpf">CPF</option>
                  <option value="email">E-mail</option>
                  <option value="telefone">Telefone</option>
                </select>
              </div>
            </div>
            {error && <p className="rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-200">{error}</p>}
            <div className="flex gap-3 pt-1">
              <button onClick={() => setEditModal(null)}
                className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-sm font-bold text-zinc-300 hover:border-zinc-500">
                Cancelar
              </button>
              <button onClick={saveEdit} disabled={saving}
                className="flex-1 rounded-lg bg-sp-gold py-2.5 text-sm font-black text-sp-black hover:brightness-110 disabled:opacity-60">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal delete */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md space-y-4 rounded-xl border border-zinc-700 bg-sp-dark p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-black text-red-400">Remover cadastro?</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  O cadastro de <strong className="text-zinc-200">{deleteConfirm.nome}</strong> (CPF: {formatCPF(deleteConfirm.cpf)}) será excluído permanentemente.
                  Os palpites feitos por ele <strong className="text-zinc-200">não serão afetados</strong>.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-sm font-bold text-zinc-300 hover:border-zinc-500">
                Cancelar
              </button>
              <button onClick={remove} disabled={saving}
                className="flex-1 rounded-lg bg-red-700 py-2.5 text-sm font-black text-white hover:bg-red-600 disabled:opacity-60">
                {saving ? 'Removendo...' : 'Sim, remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
