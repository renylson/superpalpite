import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  tipo: z.enum(['entrada', 'saida']),
  categoria: z.enum(['taxa_admin', 'fundo_premio']),
  valor: z.coerce.number().positive(),
  descricao: z.string().trim().min(3),
});

export async function GET(request: NextRequest) {
  try {
    await assertAdmin(request.headers.get('authorization'));
    const { data, error } = await createServiceSupabaseClient()
      .from('cash_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as { message?: string })?.message ?? 'Erro.' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await assertAdmin(request.headers.get('authorization'));
    const input = schema.parse(await request.json());
    const { data, error } = await createServiceSupabaseClient()
      .from('cash_entries')
      .insert({ ...input, admin_user_id: admin.id })
      .select('*').single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as { message?: string })?.message ?? 'Erro ao lançar.' }, { status: 400 });
  }
}
