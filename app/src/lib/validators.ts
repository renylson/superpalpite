import { z } from 'zod';
import { sanitizePhone } from '@/lib/utils';

export const createGuessSchema = z.object({
  pool_id: z.string().uuid(),
  cpf: z.string().regex(/^\d{11}$/, 'CPF inválido.'),
  nome: z.string().trim().min(2, 'Informe seu nome completo.').max(120),
  whatsapp: z.string().trim().min(8, 'Informe um WhatsApp válido.').transform(sanitizePhone),
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
  pix_type: z.enum(['email', 'cpf', 'telefone']),
  pix_key: z.string().trim().min(3, 'Informe sua chave Pix.').max(180),
  home_score: z.coerce.number().int().min(0).max(20),
  away_score: z.coerce.number().int().min(0).max(20),
  accepted_terms: z.literal(true, { message: 'Aceite o regulamento.' }),
  is_adult: z.literal(true, { message: 'Confirme que você é maior de 18 anos.' }),
});

export const gameSchema = z.object({
  home_team: z.string().trim().min(2),
  away_team: z.string().trim().min(2),
  home_team_logo: z.string().optional().nullable().transform(v => (v && v.trim()) || null),
  away_team_logo: z.string().optional().nullable().transform(v => (v && v.trim()) || null),
  competition: z.string().trim().optional().nullable(),
  stadium: z.string().trim().optional().nullable(),
  match_date: z.string().datetime(),
  status: z.string().default('agendado'),
});

export const poolSchema = z.object({
  game_id: z.string().uuid(),
  ticket_amount: z.coerce.number().positive(),
  admin_fee_percentage: z.coerce.number().min(0).max(100).default(40),
  minimum_prize_override: z.coerce.number().positive().optional().nullable(),
  status: z.string().default('aberto'),
});

export const resultSchema = z.object({
  pool_id: z.string().uuid(),
  home_score: z.coerce.number().int().min(0).max(20),
  away_score: z.coerce.number().int().min(0).max(20),
});

export function ensureMatchNotStarted(matchDate: string) {
  const closeTime = new Date(matchDate).getTime() - 30 * 60 * 1000;
  if (closeTime <= Date.now()) {
    throw new Error('O prazo para participar deste jogo já encerrou. Os palpites fecham 30 minutos antes da partida.');
  }
}
