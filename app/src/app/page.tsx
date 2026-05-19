import { BolaoCard } from '@/components/BolaoCard';
import { Card } from '@/components/ui/Card';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import type { Pool } from '@/types';

export const dynamic = 'force-dynamic';

async function getPools(): Promise<Pool[]> {
  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from('pools')
      .select('*, games(*)')
      .in('status', ['aberto', 'aguardando_resultado'])
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
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <p className="font-bold uppercase text-sp-gold">Palpites inteligentes. Resultados reais.</p>
        <h1 className="mt-2 text-4xl font-black md:text-6xl">Acerte o placar exato e concorra ao prêmio.</h1>
        <p className="mt-3 max-w-2xl text-zinc-300">Escolha um jogo, gere seu Pix e acompanhe os palpites confirmados em tempo real.</p>
      </div>
      {pools.length === 0 ? (
        <Card>
          <h2 className="text-xl font-black">Nenhum bolão aberto agora</h2>
          <p className="mt-2 text-zinc-400">Configure o Supabase e cadastre jogos no painel administrativo para começar.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pools.map((pool) => <BolaoCard key={pool.id} pool={pool} />)}
        </div>
      )}
    </section>
  );
}
