import { NextRequest, NextResponse } from 'next/server';
import { calculateAdminFee, calculatePrizeContribution } from '@/lib/financial';
import { createPixCharge } from '@/lib/mercadopago/pix';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { abbreviateName } from '@/lib/utils';
import { createGuessSchema, ensureMatchNotStarted } from '@/lib/validators';

export async function POST(request: NextRequest) {
  if (!rateLimit(`guess:${getClientIp(request.headers)}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Muitas tentativas. Tente novamente em instantes.' }, { status: 429 });
  }
  try {
    const input = createGuessSchema.parse(await request.json());
    const supabase = createServiceSupabaseClient();
    const { data: pool, error: poolError } = await supabase.from('pools').select('*, games(*)').eq('id', input.pool_id).single();
    if (poolError || !pool) throw new Error('Bolão não encontrado.');
    if (pool.status !== 'aberto') throw new Error('Este bolão não está aberto.');
    if (!pool.games?.match_date) throw new Error('Jogo do bolão não encontrado.');
    ensureMatchNotStarted(pool.games.match_date);

    const ticketAmount = Number(pool.ticket_amount);
    const adminFee = calculateAdminFee(ticketAmount, Number(pool.admin_fee_percentage));
    const prizeContribution = calculatePrizeContribution(ticketAmount, Number(pool.prize_percentage));
    const publicName = abbreviateName(input.nome);

    const { data: guess, error: guessError } = await supabase.from('guesses').insert({
      pool_id: pool.id,
      game_id: pool.game_id,
      nome: input.nome,
      whatsapp: input.whatsapp,
      pix_key: input.pix_key,
      home_score: input.home_score,
      away_score: input.away_score,
      ticket_amount_snapshot: ticketAmount,
      admin_fee_amount_snapshot: adminFee,
      prize_contribution_amount_snapshot: prizeContribution,
      payment_status: 'pending',
      status: 'aguardando_pagamento',
      public_name: publicName,
    }).select('*').single();
    if (guessError || !guess) throw new Error('Não foi possível salvar o palpite.');

    let pix;
    try {
      pix = await createPixCharge({
        amount: ticketAmount,
        description: `Super Palpite - ${pool.title}`,
        payerName: input.nome,
        externalReference: guess.id,
        expiresInMinutes: 30,
      });
    } catch (error) {
      await supabase.from('guesses').delete().eq('id', guess.id);
      throw error;
    }

    const { data: payment, error: paymentError } = await supabase.from('payments').insert({
      guess_id: guess.id,
      pool_id: pool.id,
      mercado_pago_id: pix.mercado_pago_id,
      qr_code: pix.qr_code,
      qr_code_base64: pix.qr_code_base64,
      copy_paste_code: pix.copy_paste_code,
      amount: ticketAmount,
      expires_at: pix.expires_at,
      status: 'pending',
    }).select('*').single();
    if (paymentError || !payment) throw new Error('Não foi possível salvar o pagamento.');

    await supabase.from('guesses').update({ mercado_pago_payment_id: pix.mercado_pago_id }).eq('id', guess.id);

    return NextResponse.json({
      guess_id: guess.id,
      payment_id: payment.id,
      qr_code: pix.qr_code,
      qr_code_base64: pix.qr_code_base64,
      copy_paste_code: pix.copy_paste_code,
      expires_at: pix.expires_at,
    });
  } catch (error) {
    console.error('Erro ao criar palpite', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao criar palpite.' }, { status: 400 });
  }
}
