'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { PublicPaidGuess } from '@/types';

export function useRealtimePalpites(poolId: string, initialGuesses: PublicPaidGuess[]) {
  const [guesses, setGuesses] = useState(initialGuesses);
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    async function reload() {
      const { data } = await supabase.from('public_paid_guesses').select('*').eq('pool_id', poolId).order('paid_at', { ascending: false });
      setGuesses((data ?? []) as PublicPaidGuess[]);
    }
    const channel = supabase.channel(`paid-guesses-${poolId}`).on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'guesses', filter: `pool_id=eq.${poolId}` },
      reload,
    ).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [poolId]);
  return guesses;
}

