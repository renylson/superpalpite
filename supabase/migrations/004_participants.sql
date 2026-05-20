CREATE TABLE IF NOT EXISTS participants (
  cpf        TEXT PRIMARY KEY,
  nome       TEXT NOT NULL,
  whatsapp   TEXT NOT NULL,
  email      TEXT NOT NULL,
  pix_type   TEXT NOT NULL CHECK (pix_type IN ('email', 'cpf', 'telefone')),
  pix_key    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
