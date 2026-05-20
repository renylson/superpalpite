import Link from 'next/link';
import { BolaoCard } from '@/components/BolaoCard';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import type { Pool } from '@/types';

export const dynamic = 'force-dynamic';

async function getPools(): Promise<Pool[]> {
  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from('pools')
      .select('*, games(*)')
      .in('status', ['aberto', 'encerrado', 'aguardando_resultado'])
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Pool[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const pools = await getPools();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-sp-black">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            Acerte o placar.<br />
            <span className="text-sp-gold">Ganhe o prêmio.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-zinc-400">
            Escolha um jogo, informe seu palpite, pague via Pix e acompanhe em tempo real.
            Se acertar o placar exato, o prêmio é seu.
          </p>

          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { label: 'Como funciona', desc: '1. Escolha o placar exato' },
              { label: '', desc: '2. Pague via Pix' },
              { label: '', desc: '3. Acertou? Receba o prêmio' },
            ].map(({ desc }, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sp-gold text-xs font-black text-sp-black">
                  {i + 1}
                </span>
                {desc.replace(/^\d+\.\s/, '')}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bolões */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black">Bolões disponíveis</h2>
          {pools.length > 0 && (
            <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-bold text-zinc-400">
              {pools.length} ativo{pools.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {pools.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-sp-dark px-6 py-14 text-center">
            <span className="text-5xl">🏟️</span>
            <h3 className="mt-4 text-xl font-black">Nenhum bolão disponível agora</h3>
            <p className="mt-2 text-zinc-400">Em breve novos bolões serão abertos. Volte mais tarde!</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pools.map((pool) => <BolaoCard key={pool.id} pool={pool} />)}
          </div>
        )}
      </section>

      {/* Info rápida */}
      <section className="border-t border-zinc-800 bg-sp-dark">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
          {[
            { icon: '🔒', title: 'Pagamento seguro', desc: 'Pix gerado via Mercado Pago com confirmação automática.' },
            { icon: '📊', title: 'Tempo real', desc: 'Acompanhe palpites confirmados e o prêmio atualizado ao vivo.' },
            { icon: '🏆', title: 'Prêmio garantido', desc: 'Prêmio mínimo assegurado, dividido entre os acertadores.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center">
              <span className="text-4xl">{icon}</span>
              <h3 className="mt-3 font-black">{title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
