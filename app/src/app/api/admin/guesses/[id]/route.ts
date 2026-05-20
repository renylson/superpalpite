import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';
import { recalculatePoolFinancials } from '@/lib/financial';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = await assertAdmin(request.headers.get('authorization'));
    const supabase = createServiceSupabaseClient();

    const { data: guess, error: fetchError } = await supabase
      .from('guesses')
      .select('pool_id')
      .eq('id', id)
      .single();
    if (fetchError || !guess) throw new Error('Palpite não encontrado.');

    const { error } = await supabase.from('guesses').delete().eq('id', id);
    if (error) throw error;

    await recalculatePoolFinancials(guess.pool_id);
    await supabase.from('audit_logs').insert({ admin_user_id: admin.id, action: 'delete_guess', entity_type: 'guess', entity_id: id });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Erro ao remover palpite.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
