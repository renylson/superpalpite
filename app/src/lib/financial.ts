import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { toMoney } from '@/lib/utils';

export function calculateAdminFee(ticketAmount: number, adminFeePercentage = 40): number {
  return Number((ticketAmount * adminFeePercentage / 100).toFixed(2));
}

export function calculatePrizeContribution(ticketAmount: number, prizePercentage = 60): number {
  return Number((ticketAmount * prizePercentage / 100).toFixed(2));
}

export function calculateMinimumPrize(ticketAmount: number): number {
  const multiplier = ticketAmount <= 19.90 ? 20 : 10;
  return Number((ticketAmount * multiplier).toFixed(2));
}

export function calculateCurrentPrize(minimumPrize: number, totalPrizeContribution: number): number {
  return Math.max(minimumPrize, totalPrizeContribution);
}

export function splitPrize(currentPrize: number, winnersCount: number): number {
  if (winnersCount <= 0) return 0;
  return toMoney(currentPrize / winnersCount);
}

export async function recalculatePoolFinancials(poolId: string): Promise<void> {
  const supabase = createServiceSupabaseClient();
  const { data: pool, error: poolError } = await supabase.from('pools').select('minimum_prize_amount').eq('id', poolId).single();
  if (poolError || !pool) throw new Error('Bolão não encontrado para recalcular financeiro.');

  const { data, error } = await supabase
    .from('guesses')
    .select('ticket_amount_snapshot, admin_fee_amount_snapshot, prize_contribution_amount_snapshot')
    .eq('pool_id', poolId)
    .eq('payment_status', 'approved');
  if (error) throw error;

  const rows = data ?? [];
  const totalCollected = toMoney(rows.reduce((sum, guess) => sum + Number(guess.ticket_amount_snapshot), 0));
  const totalAdmin = toMoney(rows.reduce((sum, guess) => sum + Number(guess.admin_fee_amount_snapshot), 0));
  const totalPrizeContribution = toMoney(rows.reduce((sum, guess) => sum + Number(guess.prize_contribution_amount_snapshot), 0));
  const currentPrize = calculateCurrentPrize(Number(pool.minimum_prize_amount), totalPrizeContribution);

  const { error: updateError } = await supabase
    .from('pools')
    .update({
      total_collected_amount: totalCollected,
      total_admin_fee_amount: totalAdmin,
      total_prize_contribution_amount: totalPrizeContribution,
      paid_guesses_count: rows.length,
      current_prize_amount: currentPrize,
      updated_at: new Date().toISOString(),
    })
    .eq('id', poolId);
  if (updateError) throw updateError;
}

