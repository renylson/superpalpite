'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';

type Entry = { id: string; tipo: string; categoria: string; valor: number; descricao: string; created_at: string };
type Totals = { total_admin: number; total_premio: number };

async function getToken() {
  const { data } = await createBrowserSupabaseClient().auth.getSession();
  return data.session?.access_token ?? '';
}

async function getPoolTotals(): Promise<Totals> {
  const supabase = createBrowserSupabaseClient();
  const { data } = await supabase.from('pools').select('total_admin_fee_amount, total_prize_contribution_amount');
  const rows = (data ?? []) as { total_admin_fee_amount: number; total_prize_contribution_amount: number }[];
  return {
    total_admin: rows.reduce((s, r) => s + Number(r.total_admin_fee_amount ?? 0), 0),
    total_premio: rows.reduce((s, r) => s + Number(r.total_prize_contribution_amount ?? 0), 0),
  };
}

export default function CaixaPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [poolTotals, setPoolTotals] = useState<Totals>({ total_admin: 0, total_premio: 0 });
  const [form, setForm] = useState({ tipo: 'saida', categoria: 'taxa_admin', valor: '', descricao: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    const token = await getToken();
    const [res, totals] = await Promise.all([
      fetch('/api/admin/caixa', { headers: { Authorization: `Bearer ${token}` } }),
      getPoolTotals(),
    ]);
    const data = await res.json();
    setEntries(Array.isArray(data) ? data : []);
    setPoolTotals(totals);
  }

  useEffect(() => { load(); }, []);

  const adminSaidas = entries.filter(e => e.tipo === 'saida' && e.categoria === 'taxa_admin').reduce((s, e) => s + Number(e.valor), 0);
  const adminEntradas = entries.filter(e => e.tipo === 'entrada' && e.categoria === 'taxa_admin').reduce((s, e) => s + Number(e.valor), 0);
  const premioSaidas = entries.filter(e => e.tipo === 'saida' && e.categoria === 'fundo_premio').reduce((s, e) => s + Number(e.valor), 0);
  const premioEntradas = entries.filter(e => e.tipo === 'entrada' && e.categoria === 'fundo_premio').reduce((s, e) => s + Number(e.valor), 0);

  const adminBalance = poolTotals.total_admin + adminEntradas - adminSaidas;
  const premioBalance = poolTotals.total_premio + premioEntradas - premioSaidas;

  async function lancamento() {
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await fetch('/api/admin/caixa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await getToken()}` },
        body: JSON.stringify({ ...form, valor: Number(form.valor) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm(f => ({ ...f, valor: '', descricao: '' }));
      setSuccess('Lançamento registrado.');
      setTimeout(() => setSuccess(''), 3000);
      load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Erro.'); }
    finally { setLoading(false); }
  }

  const catLabel = (c: string) => c === 'taxa_admin' ? 'Taxa Admin' : 'Fundo de Prêmios';
  const tipoColor = (t: string) => t === 'entrada' ? 'text-emerald-400' : 'text-red-400';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Fluxo de Caixa</h1>

      {/* Saldos */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-sp-dark p-5">
          <p className="text-sm text-zinc-400">Saldo — Taxa Administrativa</p>
          <p className={`mt-1 text-3xl font-black ${adminBalance < 0 ? 'text-red-400' : 'text-sp-gold'}`}>
            {formatCurrency(adminBalance)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Arrecadado: {formatCurrency(poolTotals.total_admin)} · Saques: {formatCurrency(adminSaidas)}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-sp-dark p-5">
          <p className="text-sm text-zinc-400">Saldo — Fundo de Prêmios</p>
          <p className={`mt-1 text-3xl font-black ${premioBalance < 0 ? 'text-red-400' : 'text-sp-gold'}`}>
            {formatCurrency(premioBalance)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Arrecadado: {formatCurrency(poolTotals.total_premio)} · Saques: {formatCurrency(premioSaidas)}</p>
        </div>
      </div>

      {/* Formulário de lançamento */}
      <div className="rounded-xl border border-zinc-800 bg-sp-dark p-5">
        <h2 className="mb-4 font-black">Novo lançamento</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase text-zinc-500">Tipo</p>
            <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
              className="min-h-10 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold">
              <option value="saida">Saída / Retirada</option>
              <option value="entrada">Entrada / Aporte</option>
            </select>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase text-zinc-500">Fundo</p>
            <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
              className="min-h-10 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold">
              <option value="taxa_admin">Taxa Administrativa</option>
              <option value="fundo_premio">Fundo de Prêmios</option>
            </select>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase text-zinc-500">Valor (R$)</p>
            <input type="number" step="0.01" min="0.01" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}
              placeholder="0,00"
              className="min-h-10 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold" />
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase text-zinc-500">Descrição</p>
            <input value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              placeholder="Ex: Saque do mês de maio"
              className="min-h-10 w-full rounded-md border border-zinc-700 bg-sp-black px-3 text-sm text-sp-white outline-none focus:border-sp-gold" />
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        {success && <p className="mt-2 text-sm font-bold text-emerald-400">✓ {success}</p>}
        <button onClick={lancamento} disabled={!form.valor || !form.descricao || loading}
          className="mt-4 rounded-lg bg-sp-gold px-6 py-2.5 text-sm font-black text-sp-black hover:brightness-110 disabled:opacity-50">
          {loading ? 'Registrando...' : 'Registrar lançamento'}
        </button>
      </div>

      {/* Histórico */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-sp-black/60 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Fundo</th>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Valor</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr key={e.id} className="border-t border-zinc-800 hover:bg-sp-black/30">
                <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                  {new Date(e.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td className={`px-4 py-3 font-bold capitalize ${tipoColor(e.tipo)}`}>{e.tipo}</td>
                <td className="px-4 py-3 text-zinc-400">{catLabel(e.categoria)}</td>
                <td className="px-4 py-3">{e.descricao}</td>
                <td className={`px-4 py-3 font-black ${tipoColor(e.tipo)}`}>
                  {e.tipo === 'saida' ? '−' : '+'}{formatCurrency(Number(e.valor))}
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-500">Nenhum lançamento registrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
