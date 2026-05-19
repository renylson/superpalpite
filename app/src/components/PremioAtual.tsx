'use client';

import { useRealtimePremio } from '@/hooks/useRealtimePremio';
import { formatCurrency } from '@/lib/utils';

export function PremioAtual({ poolId, initialPrize }: { poolId: string; initialPrize: number }) {
  const prize = useRealtimePremio(poolId, initialPrize);
  return <strong className="text-4xl font-black text-sp-gold">{formatCurrency(prize)}</strong>;
}

