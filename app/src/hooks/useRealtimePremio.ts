'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export function useRealtimePremio(poolId: string, initialPrize: number) {
  const [prize, setPrize] = useState(initialPrize);
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    const channel = supabase.channel(`pool-prize-${poolId}`).on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'pools', filter: `id=eq.${poolId}` },
      (payload) => setPrize(Number((payload.new as { current_prize_amount?: number }).current_prize_amount ?? initialPrize)),
    ).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [poolId, initialPrize]);
  return prize;
}

