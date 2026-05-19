import { NextResponse } from 'next/server';
import { recalculatePoolFinancials } from '@/lib/financial';
import { getMercadoPagoPaymentDetails } from '@/lib/mercadopago/payments';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { ensureMatchNotStarted } from '@/lib/validators';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createServiceSupabaseClient();
    const { data: payment, error: paymentError } = await supabase.from('payments').select('*').eq('id', id).single();
    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Pagamento não encontrado.' }, { status: 404 });
    }

    if (payment.status === 'approved') {
      return NextResponse.json({ status: payment.status, paid: true });
    }

    if (!payment.mercado_pago_id) {
      return NextResponse.json({ status: payment.status, paid: false });
    }

    const details = await getMercadoPagoPaymentDetails(payment.mercado_pago_id);
    const { data: guess } = await supabase.from('guesses').select('*, games(*)').eq('id', payment.guess_id).single();
    if (!guess) return NextResponse.json({ status: payment.status, paid: false });

    const amountMatches = Number(details.transaction_amount).toFixed(2) === Number(guess.ticket_amount_snapshot).toFixed(2);
    if (!amountMatches) {
      await supabase.from('payments').update({ status: 'rejected', updated_at: new Date().toISOString() }).eq('id', payment.id);
      return NextResponse.json({ status: 'rejected', paid: false });
    }

    try {
      ensureMatchNotStarted(guess.games.match_date);
    } catch {
      await supabase.from('guesses').update({ payment_status: 'expired', status: 'expirado' }).eq('id', guess.id);
      await supabase.from('payments').update({ status: 'expired', updated_at: new Date().toISOString() }).eq('id', payment.id);
      return NextResponse.json({ status: 'expired', paid: false });
    }

    if (details.status === 'approved') {
      const paidAt = new Date().toISOString();
      await supabase.from('payments').update({ status: 'approved', updated_at: paidAt }).eq('id', payment.id);
      await supabase.from('guesses').update({ payment_status: 'approved', status: 'pago_valido', paid_at: paidAt }).eq('id', guess.id);
      await recalculatePoolFinancials(payment.pool_id);
      await supabase.from('audit_logs').insert({ action: 'payment_checked_approved', entity_type: 'payment', entity_id: payment.id, metadata: { mercado_pago_id: payment.mercado_pago_id } });
      return NextResponse.json({ status: 'approved', paid: true });
    }

    await supabase.from('payments').update({ status: details.status, updated_at: new Date().toISOString() }).eq('id', payment.id);
    return NextResponse.json({ status: details.status, paid: false });
  } catch (error) {
    console.error('Erro ao verificar pagamento', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao verificar pagamento.' }, { status: 400 });
  }
}
