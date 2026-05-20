import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

const createSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'viewer']).default('admin'),
});

export async function GET(request: NextRequest) {
  try {
    await assertAdmin(request.headers.get('authorization'));
    const { data, error } = await createServiceSupabaseClient()
      .from('admin_users').select('id, name, email, role, created_at').order('created_at');
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as { message?: string })?.message ?? 'Erro.' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await assertAdmin(request.headers.get('authorization'));
    const input = createSchema.parse(await request.json());
    const supabase = createServiceSupabaseClient();

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
    });
    if (authError) throw authError;

    const { data, error } = await supabase.from('admin_users').insert({
      auth_user_id: authUser.user.id,
      name: input.name,
      email: input.email,
      role: input.role,
    }).select('*').single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as { message?: string })?.message ?? 'Erro ao criar usuário.' }, { status: 400 });
  }
}
