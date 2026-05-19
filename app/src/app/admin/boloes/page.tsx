import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';
import type { Pool } from '@/types';

export const dynamic = 'force-dynamic';

export default async function BoloesPage() {
  let pools: Pool[] = [];
  try {
    const { data } = await createServiceSupabaseClient().from('pools').select('*, games(*)').order('created_at', { ascending: false });
    pools = (data ?? []) as Pool[];
  } catch {}
  return (
    <div className="space-y-4">
      <Link href="/admin/boloes/novo"><Button>Novo bolão</Button></Link>
      {pools.length === 0 ? (
        <Card>
          <h2 className="text-xl font-black">Nenhum bolão cadastrado</h2>
          <p className="mt-2 text-zinc-400">Crie um bolão a partir de um jogo cadastrado para abrir a participação.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {pools.map((pool) => (
          <Link key={pool.id} href={`/admin/boloes/${pool.id}`}>
            <Card className="transition hover:border-sp-gold">
              <h2 className="text-xl font-black">{pool.title}</h2>
              <p className="text-zinc-400">{pool.games?.home_team} x {pool.games?.away_team} - {pool.status}</p>
              <p className="mt-2 text-sp-gold">{formatCurrency(pool.current_prize_amount)}</p>
            </Card>
          </Link>
          ))}
        </div>
      )}
    </div>
  );
}
