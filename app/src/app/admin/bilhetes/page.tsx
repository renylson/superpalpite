import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { PalpitesTable } from '@/components/admin/PalpitesTable';
import { formatCurrency } from '@/lib/utils';
import type { Guess } from '@/types';

export const dynamic = 'force-dynamic';

const statusLabel: Record<string, string> = {
  aguardando_pagamento: 'Aguardando',
  pago_valido: 'Pago',
  expirado: 'Expirado',
  cancelado: 'Cancelado',
  vencedor: 'Vencedor',
  perdedor: 'Perdedor',
};

export default async function BilhetesPage() {
  const supabase = createServiceSupabaseClient();
  let guesses: Guess[] = [];
  let stats = { total: 0, paid: 0, pending: 0, expired: 0, totalValue: 0 };

  try {
    const { data } = await supabase
      .from('guesses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    guesses = (data ?? []) as Guess[];
    stats = {
      total: guesses.length,
      paid: guesses.filter(g => g.payment_status === 'approved').length,
      pending: guesses.filter(g => g.payment_status === 'pending').length,
      expired: guesses.filter(g => g.payment_status === 'expired').length,
      totalValue: guesses.filter(g => g.payment_status === 'approved').reduce((s, g) => s + Number(g.ticket_amount_snapshot ?? 0), 0),
    };
  } catch {}

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Bilhetes</h1>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-bold text-zinc-400">
          {stats.total} no total
        </span>
      </div>

      {/* Resumo */}
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: 'Pagos', value: stats.paid, color: 'text-emerald-400' },
          { label: 'Pendentes', value: stats.pending, color: 'text-yellow-400' },
          { label: 'Expirados', value: stats.expired, color: 'text-zinc-500' },
          { label: 'Arrecadado', value: formatCurrency(stats.totalValue), color: 'text-sp-gold' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-zinc-800 bg-sp-dark p-4 text-center">
            <p className="text-xs text-zinc-500">{label}</p>
            <p className={`mt-1 text-xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {guesses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 py-12 text-center text-zinc-500">
          Nenhum bilhete registrado ainda.
        </div>
      ) : (
        <PalpitesTable guesses={guesses} />
      )}
    </div>
  );
}
