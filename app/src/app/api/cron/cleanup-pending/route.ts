import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabaseClient } from '@/lib/supabase/server';

// Chame este endpoint a cada 10 minutos via cron:
// curl -X POST https://seusite.com/api/cron/cleanup-pending -H "x-cron-secret: SEU_SECRET"

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret');
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const supabase = createServiceSupabaseClient();
  const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const { data: stale } = await supabase
    .from('guesses')
    .select('id')
    .eq('status', 'aguardando_pagamento')
    .lt('created_at', cutoff);

  if (!stale?.length) return NextResponse.json({ cleaned: 0 });

  const ids = stale.map((g) => g.id);
  await supabase.from('payments').delete().in('guess_id', ids);
  await supabase.from('guesses').delete().in('id', ids);

  return NextResponse.json({ cleaned: ids.length, ids });
}
