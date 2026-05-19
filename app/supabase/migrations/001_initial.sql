CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  competition TEXT,
  match_date TIMESTAMPTZ NOT NULL,
  stadium TEXT,
  status TEXT DEFAULT 'agendado',
  result_home_score INTEGER,
  result_away_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  ticket_amount NUMERIC(10,2) NOT NULL CHECK (ticket_amount > 0),
  admin_fee_percentage NUMERIC(5,2) NOT NULL DEFAULT 40 CHECK (admin_fee_percentage >= 0 AND admin_fee_percentage <= 100),
  prize_percentage NUMERIC(5,2) NOT NULL DEFAULT 60 CHECK (prize_percentage >= 0 AND prize_percentage <= 100),
  admin_fee_amount NUMERIC(10,2) NOT NULL,
  prize_contribution_amount NUMERIC(10,2) NOT NULL,
  minimum_prize_amount NUMERIC(10,2) NOT NULL,
  current_prize_amount NUMERIC(10,2) NOT NULL,
  paid_guesses_count INTEGER DEFAULT 0,
  total_collected_amount NUMERIC(10,2) DEFAULT 0,
  total_admin_fee_amount NUMERIC(10,2) DEFAULT 0,
  total_prize_contribution_amount NUMERIC(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'aberto',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE guesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID REFERENCES pools(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  pix_key TEXT NOT NULL,
  home_score INTEGER NOT NULL CHECK (home_score >= 0 AND home_score <= 20),
  away_score INTEGER NOT NULL CHECK (away_score >= 0 AND away_score <= 20),
  ticket_amount_snapshot NUMERIC(10,2) NOT NULL,
  admin_fee_amount_snapshot NUMERIC(10,2) NOT NULL,
  prize_contribution_amount_snapshot NUMERIC(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  mercado_pago_payment_id TEXT,
  public_name TEXT NOT NULL,
  status TEXT DEFAULT 'aguardando_pagamento',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guess_id UUID REFERENCES guesses(id) ON DELETE CASCADE,
  pool_id UUID REFERENCES pools(id) ON DELETE CASCADE,
  mercado_pago_id TEXT UNIQUE,
  qr_code TEXT,
  qr_code_base64 TEXT,
  copy_paste_code TEXT,
  amount NUMERIC(10,2) NOT NULL,
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  raw_webhook_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID REFERENCES pools(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  guess_id UUID REFERENCES guesses(id) ON DELETE SET NULL,
  prize_share NUMERIC(10,2),
  paid_status TEXT DEFAULT 'pendente',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pools_game_id ON pools(game_id);
CREATE INDEX idx_pools_status ON pools(status);
CREATE INDEX idx_games_match_date ON games(match_date);
CREATE INDEX idx_guesses_pool_id ON guesses(pool_id);
CREATE INDEX idx_guesses_game_id ON guesses(game_id);
CREATE INDEX idx_guesses_payment_status ON guesses(payment_status);
CREATE INDEX idx_guesses_mercado_pago_payment_id ON guesses(mercado_pago_payment_id);
CREATE INDEX idx_payments_guess_id ON payments(guess_id);
CREATE INDEX idx_payments_pool_id ON payments(pool_id);
CREATE INDEX idx_payments_mercado_pago_id ON payments(mercado_pago_id);
CREATE INDEX idx_winners_pool_id ON winners(pool_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);

CREATE OR REPLACE VIEW public_paid_guesses AS
SELECT id, pool_id, game_id, public_name, home_score, away_score, paid_at, created_at
FROM guesses
WHERE payment_status = 'approved' AND status IN ('pago_valido', 'vencedor', 'perdedor');

CREATE OR REPLACE VIEW public_winners AS
SELECT w.id, w.pool_id, w.game_id, w.prize_share, w.paid_status, w.created_at, g.public_name, g.home_score, g.away_score
FROM winners w
LEFT JOIN guesses g ON g.id = w.guess_id;

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE guesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read games" ON games FOR SELECT USING (true);
CREATE POLICY "public read pools" ON pools FOR SELECT USING (true);
CREATE POLICY "public create pending guesses" ON guesses FOR INSERT WITH CHECK (payment_status = 'pending');
CREATE POLICY "public read safe paid guesses" ON guesses FOR SELECT USING (payment_status = 'approved');
CREATE POLICY "public read winners" ON winners FOR SELECT USING (true);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'pools'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE pools';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'guesses'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE guesses';
    END IF;
  ELSE
    EXECUTE 'CREATE PUBLICATION supabase_realtime FOR TABLE pools, guesses';
  END IF;
END $$;
