import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';
import { gameSchema } from '@/lib/validators';

export async function GET() {
  const { data, error } = await createServiceSupabaseClient().from('games').select('*').order('match_date', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const admin = await assertAdmin(request.headers.get('authorization'));
    const body = await request.json();
    const input = gameSchema.parse({ ...body, match_date: new Date(body.match_date).toISOString() });
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase.from('games').insert(input).select('*').single();
    if (error) throw error;
    await supabase.from('audit_logs').insert({ admin_user_id: admin.id, action: 'create_game', entity_type: 'game', entity_id: data.id });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao salvar jogo.' }, { status: 400 });
  }
}

