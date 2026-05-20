CREATE TABLE IF NOT EXISTS competitions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  country    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
