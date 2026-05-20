import { Trophy, Users, DollarSign, Percent, Zap, Clock } from 'lucide-react';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function MetricCard({
  label,
  value,
  icon: Icon,
  color = 'gold',
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color?: 'gold' | 'green' | 'blue' | 'red' | 'zinc';
  sub?: string;
}) {
  const colorMap = {
    gold: 'text-sp-gold bg-sp-gold/10 border-sp-gold/20',
    green: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    red: 'text-red-400 bg-red-400/10 border-red-400/20',
    zinc: 'text-zinc-300 bg-zinc-700/30 border-zinc-700',
  };
  return (
    <div className="rounded-xl border border-zinc-800 bg-sp-dark p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="mt-1 text-2xl font-black">{value}</p>
          {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
        </div>
        <span className={`rounded-lg border p-2 ${colorMap[color]}`}>
          <Icon size={20} />
        </span>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  let metrics = { pools: 0, paid: 0, total: 0, admin: 0, prize: 0, open: 0, waiting: 0 };
  try {
    const supabase = createServiceSupabaseClient();
    const { data: pools } = await supabase.from('pools').select('*');
    const rows = pools ?? [];
    metrics = {
      pools: rows.length,
      paid: rows.reduce((sum, pool) => sum + Number(pool.paid_guesses_count ?? 0), 0),
      total: rows.reduce((sum, pool) => sum + Number(pool.total_collected_amount ?? 0), 0),
      admin: rows.reduce((sum, pool) => sum + Number(pool.total_admin_fee_amount ?? 0), 0),
      prize: rows.reduce((sum, pool) => sum + Number(pool.total_prize_contribution_amount ?? 0), 0),
      open: rows.filter((pool) => pool.status === 'aberto').length,
      waiting: rows.filter((pool) => pool.status === 'aguardando_resultado').length,
    };
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">Visão geral do sistema Super Palpite.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <MetricCard label="Total de bolões" value={metrics.pools} icon={Trophy} color="gold" />
        <MetricCard label="Palpites pagos" value={metrics.paid} icon={Users} color="green" />
        <MetricCard label="Total arrecadado" value={formatCurrency(metrics.total)} icon={DollarSign} color="blue" />
        <MetricCard label="Taxa administrativa" value={formatCurrency(metrics.admin)} icon={Percent} color="zinc" sub="40% do arrecadado" />
        <MetricCard label="Fundo de prêmios" value={formatCurrency(metrics.prize)} icon={DollarSign} color="gold" sub="60% do arrecadado" />
        <MetricCard label="Bolões abertos" value={metrics.open} icon={Zap} color="green" />
        <MetricCard label="Aguardando resultado" value={metrics.waiting} icon={Clock} color="red" />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-sp-dark p-5">
        <h2 className="mb-3 font-black text-zinc-200">Acesso rápido</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { href: '/admin/jogos/novo', label: '+ Novo jogo' },
            { href: '/admin/boloes/novo', label: '+ Novo bolão' },
            { href: '/admin/palpites', label: 'Ver palpites' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded-lg border border-zinc-700 bg-sp-black px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-sp-gold hover:text-sp-gold"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
