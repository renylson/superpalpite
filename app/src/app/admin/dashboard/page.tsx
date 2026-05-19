import { Card } from '@/components/ui/Card';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

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
  const cards = [
    ['Bolões', metrics.pools],
    ['Palpites pagos', metrics.paid],
    ['Arrecadado', formatCurrency(metrics.total)],
    ['Taxa admin', formatCurrency(metrics.admin)],
    ['Para prêmios', formatCurrency(metrics.prize)],
    ['Abertos', metrics.open],
    ['Aguardando resultado', metrics.waiting],
  ];
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value]) => <Card key={label}><p className="text-zinc-400">{label}</p><strong className="text-2xl">{value}</strong></Card>)}</div>;
}
