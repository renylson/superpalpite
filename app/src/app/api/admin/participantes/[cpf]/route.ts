import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateSchema = z.object({
  nome: z.string().trim().min(2).optional(),
  whatsapp: z.string().trim().optional(),
  email: z.string().email().optional(),
  pix_type: z.enum(['email', 'cpf', 'telefone']).optional(),
  pix_key: z.string().trim().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ cpf: string }> }) {
  try {
    const { cpf } = await params;
    await assertAdmin(request.headers.get('authorization'));
    const input = updateSchema.parse(await request.json());
    const { data, error } = await createServiceSupabaseClient()
      .from('participants')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('cpf', cpf)
      .select('*')
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as { message?: string })?.message ?? 'Erro ao atualizar.' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ cpf: string }> }) {
  try {
    const { cpf } = await params;
    await assertAdmin(request.headers.get('authorization'));
    const { error } = await createServiceSupabaseClient()
      .from('participants')
      .delete()
      .eq('cpf', cpf);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as { message?: string })?.message ?? 'Erro ao remover.' }, { status: 400 });
  }
}
