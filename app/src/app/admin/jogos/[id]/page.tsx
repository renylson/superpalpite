import { notFound } from 'next/navigation';
import { JogoForm } from '@/components/admin/JogoForm';
import { Card } from '@/components/ui/Card';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import type { Game } from '@/types';

export const dynamic = 'force-dynamic';

export default async function EditarJogoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let game: Game | null = null;
  try {
    const { data } = await createServiceSupabaseClient().from('games').select('*').eq('id', id).single();
    game = data as Game;
  } catch {}
  if (!game) notFound();
  return (
    <Card className="max-w-xl">
      <h2 className="mb-4 text-2xl font-black">Editar jogo</h2>
      <JogoForm game={game} />
    </Card>
  );
}

