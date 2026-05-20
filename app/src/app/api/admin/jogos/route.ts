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
    const { home_team_logo, away_team_logo, ...baseInput } = input;
    const supabase = createServiceSupabaseClient();

    // Tenta salvar com logos; se as colunas não existirem no banco, salva sem elas
    let result = await supabase.from('games').insert({
      ...baseInput,
      ...(home_team_logo ? { home_team_logo } : {}),
      ...(away_team_logo ? { away_team_logo } : {}),
    }).select('*').single();

    if (result.error?.message?.includes('home_team_logo') || result.error?.message?.includes('away_team_logo')) {
      result = await supabase.from('games').insert(baseInput).select('*').single();
    }

    if (result.error) throw result.error;
    await supabase.from('audit_logs').insert({ admin_user_id: admin.id, action: 'create_game', entity_type: 'game', entity_id: result.data.id });
    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao salvar jogo.' }, { status: 400 });
  }
}

