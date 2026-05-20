import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(2),
  country: z.string().trim().optional().nullable(),
});

export async function GET() {
  const { data, error } = await createServiceSupabaseClient()
    .from('competitions').select('*').order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const admin = await assertAdmin(request.headers.get('authorization'));
    const input = schema.parse(await request.json());
    const { data, error } = await createServiceSupabaseClient()
      .from('competitions').insert(input).select('*').single();
    if (error) throw error;
    await createServiceSupabaseClient().from('audit_logs').insert({ admin_user_id: admin.id, action: 'create_competition', entity_type: 'competition', entity_id: data.id });
    return NextResponse.json(data);
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Erro ao criar competição.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
