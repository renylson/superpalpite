'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

type AdminUser = { id: string; name: string; email: string; role: string; created_at: string };

async function getToken() {
  const { data } = await createBrowserSupabaseClient().auth.getSession();
  return data.session?.access_token ?? '';
}

function Field({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase text-zinc-500">{label}</p>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="min-h-10 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold" />
    </div>
  );
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const res = await fetch('/api/admin/usuarios', { headers: { Authorization: `Bearer ${await getToken()}` } });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setForm({ name: '', email: '', password: '', role: 'admin' }); setEditUser(null); setModal('create'); setError(''); }
  function openEdit(u: AdminUser) { setForm({ name: u.name, email: u.email, password: '', role: u.role }); setEditUser(u); setModal('edit'); setError(''); }

  async function save() {
    setLoading(true); setError('');
    try {
      const token = await getToken();
      const body: Record<string, string> = {};
      if (modal === 'create') {
        body.name = form.name; body.email = form.email; body.password = form.password; body.role = form.role;
      } else {
        if (form.name) body.name = form.name;
        if (form.email) body.email = form.email;
        if (form.password) body.password = form.password;
        if (form.role) body.role = form.role;
      }
      const url = modal === 'create' ? '/api/admin/usuarios' : `/api/admin/usuarios/${editUser!.id}`;
      const res = await fetch(url, {
        method: modal === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setModal(null);
      load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Erro.'); }
    finally { setLoading(false); }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Remover o usuário "${name}"? Esta ação não pode ser desfeita.`)) return;
    const res = await fetch(`/api/admin/usuarios/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${await getToken()}` },
    });
    const data = await res.json();
    if (res.ok) load(); else alert(data.error);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Usuários administrativos</h1>
        <button onClick={openCreate}
          className="rounded-lg bg-sp-gold px-4 py-2 text-sm font-black text-sp-black hover:brightness-110">
          + Novo usuário
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-sp-black/60 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Perfil</th>
              <th className="px-4 py-3">Criado em</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-zinc-800 hover:bg-sp-black/30">
                <td className="px-4 py-3 font-bold">{u.name}</td>
                <td className="px-4 py-3 text-zinc-400">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${u.role === 'admin' ? 'bg-sp-gold/10 text-sp-gold' : 'bg-zinc-800 text-zinc-400'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">
                  {new Date(u.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(u)} className="text-xs font-bold text-sp-gold hover:underline">Editar</button>
                    <button onClick={() => remove(u.id, u.name)} className="text-xs font-bold text-red-400 hover:underline">Remover</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md space-y-4 rounded-xl border border-zinc-700 bg-sp-dark p-6 shadow-2xl">
            <h3 className="text-xl font-black">{modal === 'create' ? 'Novo usuário' : `Editar — ${editUser?.name}`}</h3>
            <div className="space-y-3">
              <Field label="Nome completo" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="João Silva" />
              <Field label="E-mail" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" placeholder="admin@email.com" />
              <Field label={modal === 'create' ? 'Senha' : 'Nova senha (deixe vazio para não alterar)'} value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} type="password" placeholder="Mínimo 8 caracteres" />
              <div>
                <p className="mb-1 text-xs font-bold uppercase text-zinc-500">Perfil</p>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="min-h-10 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold">
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer (somente leitura)</option>
                </select>
              </div>
            </div>
            {error && <p className="rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-sm text-red-200">{error}</p>}
            <div className="flex gap-3 pt-1">
              <button onClick={() => setModal(null)}
                className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-sm font-bold text-zinc-300 hover:border-zinc-500">
                Cancelar
              </button>
              <button onClick={save} disabled={loading}
                className="flex-1 rounded-lg bg-sp-gold py-2.5 text-sm font-black text-sp-black hover:brightness-110 disabled:opacity-60">
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
