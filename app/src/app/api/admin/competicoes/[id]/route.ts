import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(2),
  country: z.string().trim().optional().nullable(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await assertAdmin(request.headers.get('authorization'));
    const input = schema.parse(await request.json());
    const { data, error } = await createServiceSupabaseClient()
      .from('competitions').update(input).eq('id', id).select('*').single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as { message?: string })?.message ?? 'Erro.' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await assertAdmin(request.headers.get('authorization'));
    const { error } = await createServiceSupabaseClient().from('competitions').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as { message?: string })?.message ?? 'Erro.' }, { status: 400 });
  }
}
