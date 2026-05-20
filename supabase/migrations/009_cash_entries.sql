CREATE TABLE IF NOT EXISTS cash_entries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo          TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  categoria     TEXT NOT NULL CHECK (categoria IN ('taxa_admin', 'fundo_premio')),
  valor         NUMERIC(12,2) NOT NULL CHECK (valor > 0),
  descricao     TEXT NOT NULL,
  admin_user_id UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
