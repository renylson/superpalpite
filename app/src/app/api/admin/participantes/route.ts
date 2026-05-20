import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    await assertAdmin(request.headers.get('authorization'));
    const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';
    const supabase = createServiceSupabaseClient();

    let query = supabase
      .from('participants')
      .select('cpf, nome, whatsapp, email, pix_type, pix_key, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(500);

    if (q) {
      query = query.or(`nome.ilike.%${q}%,email.ilike.%${q}%,cpf.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (error) {
    return NextResponse.json({ error: (error as { message?: string })?.message ?? 'Erro.' }, { status: 400 });
  }
}
