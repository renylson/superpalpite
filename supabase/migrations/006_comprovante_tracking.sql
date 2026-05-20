ALTER TABLE guesses
  ADD COLUMN IF NOT EXISTS comprovante_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS comprovante_error    TEXT;
