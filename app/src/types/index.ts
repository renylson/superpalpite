export type PoolStatus = 'aberto' | 'encerrado' | 'aguardando_resultado' | 'resultado_publicado' | 'premio_pago' | 'sem_ganhadores' | 'cancelado';
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'canceled' | 'refunded';
export type GuessStatus = 'aguardando_pagamento' | 'pago_valido' | 'expirado' | 'cancelado' | 'vencedor' | 'perdedor';
export type GameStatus = 'agendado' | 'em_andamento' | 'finalizado' | 'cancelado';
export type WinnerPaidStatus = 'pendente' | 'pago';

export interface Game {
  id: string;
  home_team: string;
  away_team: string;
  home_team_logo: string | null;
  away_team_logo: string | null;
  competition: string | null;
  match_date: string;
  stadium: string | null;
  status: GameStatus;
  result_home_score: number | null;
  result_away_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Pool {
  id: string;
  title: string;
  game_id: string | null;
  ticket_amount: number;
  admin_fee_percentage: number;
  prize_percentage: number;
  admin_fee_amount: number;
  prize_contribution_amount: number;
  minimum_prize_amount: number;
  current_prize_amount: number;
  paid_guesses_count: number;
  total_collected_amount: number;
  total_admin_fee_amount: number;
  total_prize_contribution_amount: number;
  status: PoolStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  games?: Game | null;
}

export interface Guess {
  id: string;
  pool_id: string;
  game_id: string | null;
  nome: string;
  whatsapp: string;
  pix_key: string;
  home_score: number;
  away_score: number;
  ticket_amount_snapshot: number;
  admin_fee_amount_snapshot: number;
  prize_contribution_amount_snapshot: number;
  payment_status: PaymentStatus;
  mercado_pago_payment_id: string | null;
  public_name: string;
  status: GuessStatus;
  created_at: string;
  paid_at: string | null;
  canceled_at: string | null;
}

export interface Payment {
  id: string;
  guess_id: string;
  pool_id: string;
  mercado_pago_id: string | null;
  qr_code: string | null;
  qr_code_base64: string | null;
  copy_paste_code: string | null;
  amount: number;
  expires_at: string | null;
  status: PaymentStatus;
  raw_webhook_payload: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Winner {
  id: string;
  pool_id: string;
  game_id: string | null;
  guess_id: string | null;
  prize_share: number;
  paid_status: WinnerPaidStatus;
  paid_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  auth_user_id: string | null;
  name: string;
  email: string;
  password_hash: string | null;
  role: 'admin' | 'viewer';
  created_at: string;
  updated_at: string;
}

export interface PublicPaidGuess {
  id: string;
  pool_id: string;
  game_id: string | null;
  public_name: string;
  home_score: number;
  away_score: number;
  paid_at: string | null;
  created_at: string;
}

