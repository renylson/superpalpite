import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';

function errMsg(error: unknown, fallback: string) {
  return (error as { message?: string })?.message || fallback;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = await assertAdmin(request.headers.get('authorization'));
    const body = await request.json();
    const supabase = createServiceSupabaseClient();

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if ('is_active' in body) update.is_active = Boolean(body.is_active);
    if ('status' in body) update.status = body.status;

    let result = await supabase.from('pools').update(update).eq('id', id).select('*').single();

    // Fallback: se a coluna is_active não existir ainda, tenta sem ela
    if (result.error?.message?.includes('is_active')) {
      const { is_active: _ia, ...updateWithoutActive } = update;
      result = await supabase.from('pools').update(updateWithoutActive).eq('id', id).select('*').single();
      if (!result.error) {
        return NextResponse.json(
          { ...result.data, _warning: 'Execute a migration 003_pool_active.sql no Supabase para ativar o controle de visibilidade.' },
          { status: 200 }
        );
      }
    }

    if (result.error) throw result.error;
    await supabase.from('audit_logs').insert({ admin_user_id: admin.id, action: 'update_pool', entity_type: 'pool', entity_id: id });
    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json({ error: errMsg(error, 'Erro ao atualizar bolão.') }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = await assertAdmin(request.headers.get('authorization'));
    const supabase = createServiceSupabaseClient();

    await supabase.from('guesses').delete().eq('pool_id', id);
    const { error } = await supabase.from('pools').delete().eq('id', id);
    if (error) throw error;
    await supabase.from('audit_logs').insert({ admin_user_id: admin.id, action: 'delete_pool', entity_type: 'pool', entity_id: id });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: errMsg(error, 'Erro ao excluir bolão.') }, { status: 400 });
  }
}
