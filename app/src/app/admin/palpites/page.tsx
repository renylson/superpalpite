import { PalpitesTable } from '@/components/admin/PalpitesTable';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import type { Guess } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminPalpitesPage() {
  let guesses: Guess[] = [];
  try {
    const { data } = await createServiceSupabaseClient().from('guesses').select('*').order('created_at', { ascending: false }).limit(200);
    guesses = (data ?? []) as Guess[];
  } catch {}
  if (guesses.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-sp-dark p-4 shadow-sm">
        <h2 className="text-xl font-black">Nenhum palpite cadastrado</h2>
        <p className="mt-2 text-zinc-400">Os palpites aparecerão aqui quando participantes gerarem Pix nos bolões.</p>
      </div>
    );
  }
  return <PalpitesTable guesses={guesses} />;
}
