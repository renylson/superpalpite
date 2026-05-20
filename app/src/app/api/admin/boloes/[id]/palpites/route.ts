import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';
import { recalculatePoolFinancials } from '@/lib/financial';
import { sanitizePhone } from '@/lib/utils';
import { z } from 'zod';

const manualGuessSchema = z.object({
  nome: z.string().trim().min(2),
  whatsapp: z.string().trim().min(8).transform(sanitizePhone),
  pix_key: z.string().trim().min(3),
  home_score: z.coerce.number().int().min(0).max(20),
  away_score: z.coerce.number().int().min(0).max(20),
});

function makePublicName(nome: string): string {
  const parts = nome.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

function generateComprovanteKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'SP' + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = await assertAdmin(request.headers.get('authorization'));
    const input = manualGuessSchema.parse(await request.json());
    const supabase = createServiceSupabaseClient();

    const { data: pool, error: poolError } = await supabase
      .from('pools')
      .select('game_id, ticket_amount_snapshot:ticket_amount, admin_fee_amount_snapshot:admin_fee_amount, prize_contribution_amount_snapshot:prize_contribution_amount')
      .eq('id', id)
      .single();
    if (poolError || !pool) throw new Error('Bolão não encontrado.');

    const { data: guess, error: guessError } = await supabase
      .from('guesses')
      .insert({
        pool_id: id,
        game_id: pool.game_id,
        nome: input.nome,
        whatsapp: input.whatsapp,
        pix_key: input.pix_key,
        home_score: input.home_score,
        away_score: input.away_score,
        public_name: makePublicName(input.nome),
        comprovante_key: generateComprovanteKey(),
        payment_status: 'approved',
        status: 'pago_valido',
        paid_at: new Date().toISOString(),
        ticket_amount_snapshot: pool.ticket_amount_snapshot,
        admin_fee_amount_snapshot: pool.admin_fee_amount_snapshot,
        prize_contribution_amount_snapshot: pool.prize_contribution_amount_snapshot,
      })
      .select('*')
      .single();
    if (guessError) throw guessError;

    await recalculatePoolFinancials(id);
    await supabase.from('audit_logs').insert({ admin_user_id: admin.id, action: 'manual_guess', entity_type: 'guess', entity_id: guess.id });
    return NextResponse.json(guess);
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Erro ao adicionar palpite.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
