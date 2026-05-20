'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

type Competition = { id: string; name: string; country: string | null; created_at: string };

async function getToken() {
  const { data } = await createBrowserSupabaseClient().auth.getSession();
  return data.session?.access_token ?? '';
}

export default function CompeticoesPage() {
  const [list, setList] = useState<Competition[]>([]);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const res = await fetch('/api/admin/competicoes', { headers: { Authorization: `Bearer ${await getToken()}` } });
    const data = await res.json();
    setList(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const url = editId ? `/api/admin/competicoes/${editId}` : '/api/admin/competicoes';
      const method = editId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, country: country || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setName(''); setCountry(''); setEditId(null);
      load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Erro.'); }
    finally { setLoading(false); }
  }

  async function remove(id: string) {
    if (!confirm('Remover esta competição?')) return;
    const res = await fetch(`/api/admin/competicoes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${await getToken()}` },
    });
    if (res.ok) load();
    else { const d = await res.json(); alert(d.error); }
  }

  function startEdit(c: Competition) {
    setEditId(c.id); setName(c.name); setCountry(c.country ?? '');
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-black">Competições</h1>

      <div className="rounded-xl border border-zinc-800 bg-sp-dark p-5">
        <h2 className="mb-4 font-black">{editId ? 'Editar competição' : 'Nova competição'}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-bold uppercase text-zinc-500">Nome</p>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Brasileirão Série A"
              className="min-h-10 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold" />
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase text-zinc-500">País / categoria</p>
            <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Ex: Brasil"
              className="min-h-10 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold" />
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <div className="mt-3 flex gap-2">
          <button onClick={save} disabled={!name || loading}
            className="rounded-lg bg-sp-gold px-5 py-2.5 text-sm font-black text-sp-black hover:brightness-110 disabled:opacity-50">
            {loading ? 'Salvando...' : editId ? 'Atualizar' : 'Adicionar'}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setName(''); setCountry(''); }}
              className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-bold text-zinc-300 hover:border-zinc-500">
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-sp-black/60 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">País</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.map(c => (
              <tr key={c.id} className="border-t border-zinc-800 hover:bg-sp-black/30">
                <td className="px-4 py-3 font-bold">{c.name}</td>
                <td className="px-4 py-3 text-zinc-400">{c.country ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(c)} className="text-xs font-bold text-sp-gold hover:underline">Editar</button>
                    <button onClick={() => remove(c.id)} className="text-xs font-bold text-red-400 hover:underline">Remover</button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-zinc-500">Nenhuma competição cadastrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
