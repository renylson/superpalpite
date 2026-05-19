import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

export function FinancialSummary({ total, admin, prize, paid }: { total: number; admin: number; prize: number; paid: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <Card><p className="text-sm text-zinc-400">Arrecadado</p><strong>{formatCurrency(total)}</strong></Card>
      <Card><p className="text-sm text-zinc-400">Admin</p><strong>{formatCurrency(admin)}</strong></Card>
      <Card><p className="text-sm text-zinc-400">Prêmios</p><strong>{formatCurrency(prize)}</strong></Card>
      <Card><p className="text-sm text-zinc-400">Pagos</p><strong>{paid}</strong></Card>
    </div>
  );
}

