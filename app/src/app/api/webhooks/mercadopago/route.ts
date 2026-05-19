import { NextRequest, NextResponse } from 'next/server';
import { recalculatePoolFinancials } from '@/lib/financial';
import { getMercadoPagoPaymentDetails } from '@/lib/mercadopago/payments';
import { validateMercadoPagoSignature } from '@/lib/mercadopago/pix';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { ensureMatchNotStarted } from '@/lib/validators';

export async function POST(request: NextRequest) {
  if (!rateLimit(`mp:${getClientIp(request.headers)}`, 80, 60_000)) {
    return NextResponse.json({ error: 'Rate limit' }, { status: 429 });
  }
  if (!validateMercadoPagoSignature(request.headers)) {
    return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 401 });
  }
  const payload = await request.json();
  const mercadoPagoId = String(payload?.data?.id ?? payload?.id ?? '');
  if (!mercadoPagoId) return NextResponse.json({ ok: true });

  const supabase = createServiceSupabaseClient();
  const { data: payment } = await supabase.from('payments').select('*').eq('mercado_pago_id', mercadoPagoId).single();
  if (!payment) return NextResponse.json({ ok: true });
  if (payment.status === 'approved') return NextResponse.json({ ok: true });

  const details = await getMercadoPagoPaymentDetails(mercadoPagoId);
  const { data: guess } = await supabase.from('guesses').select('*, games(*)').eq('id', payment.guess_id).single();
  if (!guess) return NextResponse.json({ ok: true });

  const amountMatches = Number(details.transaction_amount).toFixed(2) === Number(guess.ticket_amount_snapshot).toFixed(2);
  if (!amountMatches) {
    await supabase.from('payments').update({ status: 'rejected', raw_webhook_payload: payload }).eq('id', payment.id);
    return NextResponse.json({ ok: true });
  }

  try {
    ensureMatchNotStarted(guess.games.match_date);
  } catch {
    await supabase.from('guesses').update({ payment_status: 'expired', status: 'expirado' }).eq('id', guess.id);
    await supabase.from('payments').update({ status: 'expired', raw_webhook_payload: payload }).eq('id', payment.id);
    return NextResponse.json({ ok: true });
  }

  if (details.status === 'approved') {
    await supabase.from('payments').update({ status: 'approved', raw_webhook_payload: payload, updated_at: new Date().toISOString() }).eq('id', payment.id);
    await supabase.from('guesses').update({ payment_status: 'approved', status: 'pago_valido', paid_at: new Date().toISOString() }).eq('id', guess.id);
    await recalculatePoolFinancials(payment.pool_id);
    await supabase.from('audit_logs').insert({ action: 'payment_approved', entity_type: 'payment', entity_id: payment.id, metadata: { mercado_pago_id: mercadoPagoId } });
  } else {
    await supabase.from('payments').update({ status: details.status, raw_webhook_payload: payload, updated_at: new Date().toISOString() }).eq('id', payment.id);
  }

  return NextResponse.json({ ok: true });
}
