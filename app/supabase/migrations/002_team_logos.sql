-- Adiciona colunas de logo/bandeira para os times nas partidas
ALTER TABLE games
  ADD COLUMN IF NOT EXISTS home_team_logo TEXT,
  ADD COLUMN IF NOT EXISTS away_team_logo TEXT;
