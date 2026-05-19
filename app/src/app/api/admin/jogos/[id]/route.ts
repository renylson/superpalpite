import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';
import { gameSchema } from '@/lib/validators';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = await assertAdmin(request.headers.get('authorization'));
    const body = await request.json();
    const input = gameSchema.parse({ ...body, match_date: new Date(body.match_date).toISOString() });
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from('games')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    await supabase.from('audit_logs').insert({ admin_user_id: admin.id, action: 'update_game', entity_type: 'game', entity_id: id });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao atualizar jogo.' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = await assertAdmin(request.headers.get('authorization'));
    const supabase = createServiceSupabaseClient();
    const { count, error: countError } = await supabase
      .from('pools')
      .select('id', { count: 'exact', head: true })
      .eq('game_id', id);
    if (countError) throw countError;
    if ((count ?? 0) > 0) {
      throw new Error('Este jogo possui bolão vinculado. Exclua ou cancele o bolão antes de remover o jogo.');
    }
    const { error } = await supabase.from('games').delete().eq('id', id);
    if (error) throw error;
    await supabase.from('audit_logs').insert({ admin_user_id: admin.id, action: 'delete_game', entity_type: 'game', entity_id: id });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao excluir jogo.' }, { status: 400 });
  }
}
