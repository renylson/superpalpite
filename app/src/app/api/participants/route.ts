import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const cpf = request.nextUrl.searchParams.get('cpf')?.replace(/\D/g, '');
  if (!cpf || cpf.length !== 11) {
    return NextResponse.json({ error: 'CPF inválido.' }, { status: 400 });
  }
  const { data, error } = await createServiceSupabaseClient()
    .from('participants')
    .select('cpf, nome, whatsapp, email, pix_type, pix_key')
    .eq('cpf', cpf)
    .single();
  if (error || !data) return NextResponse.json({ found: false }, { status: 404 });
  return NextResponse.json({ found: true, participant: data });
}
