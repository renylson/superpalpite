import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ComprovanteView } from '@/components/ComprovanteView';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { formatDateTime } from '@/lib/utils';
type GuessWithGame = {
  id: string;
  public_name: string;
  home_score: number;
  away_score: number;
  ticket_amount_snapshot: number;
  paid_at: string | null;
  mercado_pago_payment_id: string | null;
  games: {
    home_team: string;
    away_team: string;
    competition: string | null;
    match_date: string;
  } | null;
};

async function getData(key: string) {
  const { data } = await createServiceSupabaseClient()
    .from('guesses')
    .select('id, public_name, home_score, away_score, ticket_amount_snapshot, paid_at, mercado_pago_payment_id, games(home_team, away_team, competition, match_date)')
    .eq('comprovante_key', key)
    .eq('payment_status', 'approved')
    .single();
  return data as GuessWithGame | null;
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  const guess = await getData(key);
  if (!guess) return { title: 'Comprovante não encontrado' };
  const game = guess.games;
  return {
    title: `Comprovante ${key} — Super Palpite`,
    description: `Palpite de ${guess.public_name}: ${guess.home_score} × ${guess.away_score} — ${game?.home_team} x ${game?.away_team}`,
    openGraph: {
      title: `✅ Comprovante de Palpite — Super Palpite`,
      description: `${guess.public_name} apostou ${guess.home_score} × ${guess.away_score} em ${game?.home_team} x ${game?.away_team}`,
    },
  };
}

export default async function ComprovantePage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const guess = await getData(key);
  if (!guess) notFound();

  const game = guess.games;
  if (!game) notFound();

  return (
    <ComprovanteView
      comprovanteKey={key}
      nome={guess.public_name}
      homeTeam={game.home_team}
      awayTeam={game.away_team}
      competition={game.competition}
      matchDate={game.match_date ? formatDateTime(game.match_date) : ''}
      homeScore={guess.home_score}
      awayScore={guess.away_score}
      ticketAmount={Number(guess.ticket_amount_snapshot)}
      paidAt={guess.paid_at ?? ''}
      isManual={!guess.mercado_pago_payment_id}
    />
  );
}
