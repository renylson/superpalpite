import Link from 'next/link';
import { JogoActions } from '@/components/admin/JogoActions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { formatDateTime } from '@/lib/utils';
import type { Game } from '@/types';

export const dynamic = 'force-dynamic';

export default async function JogosPage() {
  let games: Game[] = [];
  try {
    const { data } = await createServiceSupabaseClient().from('games').select('*').order('match_date', { ascending: false });
    games = (data ?? []) as Game[];
  } catch {}
  return (
    <div className="space-y-4">
      <Link href="/admin/jogos/novo"><Button>Novo jogo</Button></Link>
      {games.length === 0 ? (
        <Card>
          <h2 className="text-xl font-black">Nenhum jogo cadastrado</h2>
          <p className="mt-2 text-zinc-400">Cadastre o primeiro jogo para criar bolões e receber palpites.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {games.map((game) => (
          <Card key={game.id}>
            <h2 className="text-xl font-black">{game.home_team} x {game.away_team}</h2>
            <p className="text-zinc-400">{game.competition || 'Futebol'} - {formatDateTime(game.match_date)} - {game.status}</p>
            <JogoActions gameId={game.id} />
          </Card>
          ))}
        </div>
      )}
    </div>
  );
}
