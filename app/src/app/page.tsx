import { BannerCarousel } from '@/components/BannerCarousel';
import { BolaoCard } from '@/components/BolaoCard';
import { BolaoCardEncerrado } from '@/components/BolaoCardEncerrado';
import { EncerradosSection } from '@/components/EncerradosSection';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import type { Pool } from '@/types';

export const dynamic = 'force-dynamic';

async function getData() {
  try {
    const supabase = createServiceSupabaseClient();
    const [{ data: open }, { data: closed }] = await Promise.all([
      supabase
        .from('pools')
        .select('*, games(*)')
        .in('status', ['aberto', 'encerrado'])
        .eq('is_active', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('pools')
        .select('*, games(*)')
        .in('status', ['resultado_publicado', 'premio_pago', 'sem_ganhadores', 'aguardando_resultado'])
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(12),
    ]);
    return {
      openPools: (open ?? []) as Pool[],
      closedPools: (closed ?? []) as Pool[],
    };
  } catch {
    return { openPools: [], closedPools: [] };
  }
}

export default async function HomePage() {
  const { openPools, closedPools } = await getData();

  return (
    <>
      {/* Carousel de banners */}
      <BannerCarousel />

      {/* Jogos disponíveis */}
      <section id="jogos" className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black">Jogos disponíveis</h2>
          {openPools.length > 0 && (
            <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-bold text-zinc-400">
              {openPools.length} ativo{openPools.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {openPools.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-sp-dark px-6 py-14 text-center">
            <span className="text-5xl">🏟️</span>
            <h3 className="mt-4 text-xl font-black">Nenhum jogo disponível agora</h3>
            <p className="mt-2 text-zinc-400">Em breve novos bolões serão abertos. Volte mais tarde!</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {openPools.map((pool) => (
              <BolaoCard key={pool.id} pool={pool} />
            ))}
          </div>
        )}
      </section>

      {/* Jogos já encerrados */}
      {closedPools.length > 0 && (
        <section className="border-t border-zinc-800 bg-sp-dark/50">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="mb-6 text-2xl font-black">Jogos já encerrados</h2>
            <EncerradosSection pools={closedPools} />
          </div>
        </section>
      )}

    </>
  );
}
