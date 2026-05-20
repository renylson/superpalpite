import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['admin', 'viewer']).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await assertAdmin(request.headers.get('authorization'));
    const input = updateSchema.parse(await request.json());
    const supabase = createServiceSupabaseClient();

    const { data: user } = await supabase.from('admin_users').select('auth_user_id').eq('id', id).single();
    if (!user) throw new Error('Usuário não encontrado.');

    if ((input.email || input.password) && user.auth_user_id) {
      const authUpdate: Record<string, string> = {};
      if (input.email) authUpdate.email = input.email;
      if (input.password) authUpdate.password = input.password;
      const { error } = await supabase.auth.admin.updateUserById(user.auth_user_id, authUpdate);
      if (error) throw error;
    }

    const dbUpdate: Record<string, string> = { updated_at: new Date().toISOString() };
    if (input.name) dbUpdate.name = input.name;
    if (input.email) dbUpdate.email = input.email;
    if (input.role) dbUpdate.role = input.role;

    const { data, error } = await supabase.from('admin_users').update(dbUpdate).eq('id', id).select('*').single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as { message?: string })?.message ?? 'Erro ao atualizar.' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const currentAdmin = await assertAdmin(request.headers.get('authorization'));
    if (currentAdmin.id === id) throw new Error('Não é possível remover seu próprio usuário.');
    const supabase = createServiceSupabaseClient();

    const { data: user } = await supabase.from('admin_users').select('auth_user_id').eq('id', id).single();
    if (!user) throw new Error('Usuário não encontrado.');

    if (user.auth_user_id) {
      await supabase.auth.admin.deleteUser(user.auth_user_id);
    }
    await supabase.from('admin_users').delete().eq('id', id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as { message?: string })?.message ?? 'Erro ao remover.' }, { status: 400 });
  }
}
