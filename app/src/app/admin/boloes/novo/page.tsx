import { BolaoForm } from '@/components/admin/BolaoForm';
import { Card } from '@/components/ui/Card';
import { createServiceSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function NovoBolaoPage() {
  let games: { id: string; home_team: string; away_team: string }[] = [];
  try {
    const { data } = await createServiceSupabaseClient().from('games').select('id, home_team, away_team').order('match_date', { ascending: true });
    games = data ?? [];
  } catch {}
  return <Card className="max-w-xl"><h2 className="mb-4 text-2xl font-black">Novo bolão</h2><BolaoForm games={games} /></Card>;
}
