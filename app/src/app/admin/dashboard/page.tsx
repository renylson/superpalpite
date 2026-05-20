import Link from 'next/link';
import { Trophy, Users, DollarSign, Zap, Clock, CheckCircle, TrendingUp, Award } from 'lucide-react';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function MetricCard({ label, value, icon: Icon, color = 'gold', sub }: {
  label: string; value: string | number; icon: React.ElementType;
  color?: 'gold' | 'green' | 'blue' | 'red' | 'zinc'; sub?: string;
}) {
  const colorMap: Record<string, string> = {
    gold: 'text-sp-gold bg-sp-gold/10 border-sp-gold/20',
    green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    red: 'text-red-400 bg-red-400/10 border-red-400/20',
    zinc: 'text-zinc-300 bg-zinc-700/30 border-zinc-700',
  };
  return (
    <div className="rounded-xl border border-zinc-800 bg-sp-dark p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="mt-1 truncate text-2xl font-black">{value}</p>
          {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
        </div>
        <span className={`shrink-0 rounded-lg border p-2 ${colorMap[color]}`}>
          <Icon size={20} />
        </span>
      </div>
    </div>
  );
}

type Row = { [key: string]: unknown };

export default async function DashboardPage() {
  const supabase = createServiceSupabaseClient();
  let metrics = { pools: 0, paid: 0, total: 0, admin: 0, prize: 0, open: 0, waiting: 0, finished: 0, pendingWinners: 0, avgTicket: 0 };

  try {
    const poolsRes = await supabase.from('pools').select('paid_guesses_count, total_collected_amount, total_admin_fee_amount, total_prize_contribution_amount, status');
    const winnersRes = await supabase.from('winners').select('paid_status');
    const rows = (poolsRes.data ?? []) as Row[];
    const winners = (winnersRes.data ?? []) as Row[];
    const n = (r: Row, k: string) => Number(r[k] ?? 0);
    const totalPaid = rows.reduce((s, r) => s + n(r, 'paid_guesses_count'), 0);
    const totalCollected = rows.reduce((s, r) => s + n(r, 'total_collected_amount'), 0);
    metrics = {
      pools: rows.length,
      paid: totalPaid,
      total: totalCollected,
      admin: rows.reduce((s, r) => s + n(r, 'total_admin_fee_amount'), 0),
      prize: rows.reduce((s, r) => s + n(r, 'total_prize_contribution_amount'), 0),
      open: rows.filter(r => r.status === 'aberto').length,
      waiting: rows.filter(r => r.status === 'aguardando_resultado').length,
      finished: rows.filter(r => ['resultado_publicado', 'premio_pago', 'sem_ganhadores'].includes(r.status as string)).length,
      pendingWinners: winners.filter(w => w.paid_status === 'pendente').length,
      avgTicket: totalPaid > 0 ? totalCollected / totalPaid : 0,
    };
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">Visão geral do Super Palpite.</p>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Financeiro</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard label="Total arrecadado" value={formatCurrency(metrics.total)} icon={DollarSign} color="blue" />
          <MetricCard label="Taxa administrativa" value={formatCurrency(metrics.admin)} icon={DollarSign} color="zinc" />
          <MetricCard label="Fundo de prêmios" value={formatCurrency(metrics.prize)} icon={DollarSign} color="gold" />
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Atividade</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total de bolões" value={metrics.pools} icon={Trophy} color="gold" />
          <MetricCard label="Palpites confirmados" value={metrics.paid} icon={Users} color="green" />
          <MetricCard label="Ticket médio" value={formatCurrency(metrics.avgTicket)} icon={TrendingUp} color="blue" />
          <MetricCard label="Vencedores a pagar" value={metrics.pendingWinners} icon={Award} color={metrics.pendingWinners > 0 ? 'red' : 'zinc'} sub={metrics.pendingWinners > 0 ? 'Atenção necessária' : undefined} />
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Status dos bolões</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard label="Abertos" value={metrics.open} icon={Zap} color="green" />
          <MetricCard label="Aguardando resultado" value={metrics.waiting} icon={Clock} color="red" />
          <MetricCard label="Encerrados" value={metrics.finished} icon={CheckCircle} color="zinc" />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-sp-dark p-5">
        <h2 className="mb-3 font-black text-zinc-200">Acesso rápido</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: '/admin/jogos/novo', label: '+ Novo jogo' },
            { href: '/admin/boloes/novo', label: '+ Novo bolão' },
            { href: '/admin/competicoes', label: 'Competições' },
            { href: '/admin/caixa', label: 'Fluxo de caixa' },
          ].map(({ href, label }) => (
            <a key={href} href={href}
              className="rounded-lg border border-zinc-700 bg-sp-black px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-sp-gold hover:text-sp-gold">
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
