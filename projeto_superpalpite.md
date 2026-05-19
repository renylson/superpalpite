# SUPER PALPITE 

---

## 1. Contexto e Missão

Você é uma equipe técnica completa de desenvolvimento SaaS. Sua missão é implementar do zero a aplicação **Super Palpite** — um sistema web profissional de bolões de placar exato em jogos de futebol, com pagamento via Pix pelo Mercado Pago, painel administrativo, cálculo automático de taxas e premiação, lista pública de palpites pagos, apuração automática de vencedores, segurança, privacidade, Docker isolado e Supabase para acelerar a entrega.

Atue simultaneamente como:

- Product Manager
- UX/UI Designer
- Frontend Engineer
- Backend Engineer
- Database/Supabase Engineer
- DevOps/Docker Engineer
- Security Engineer
- QA Engineer
- Especialista em pagamentos Mercado Pago
- Especialista em LGPD e riscos operacionais

Quando faltar alguma informação, faça hipóteses explícitas, documente-as e continue com uma proposta prática. **Nunca trave o desenvolvimento.**

---

## 2. Ambiente de Execução e Infraestrutura

O projeto será instalado em um servidor Linux Debian com Docker já instalado e em uso.

### Regras obrigatórias do ambiente

- Existem containers Docker já em execução no servidor.
- **Nunca parar, remover, modificar ou interferir em containers, volumes, redes ou arquivos de outros projetos existentes.**
- Criar todo o projeto em uma pasta isolada e dedicada:
  - Preferencial: `/opt/superpalpite`
  - Alternativa: `/root/superpalpite`
- Antes de definir portas, sempre verificar portas disponíveis com:

```bash
docker ps
ss -tlnp
```

- Usar portas que não conflitem com serviços existentes.
- Toda configuração Docker deve usar redes próprias isoladas com prefixo `superpalpite_`.
- O projeto deve subir com:

```bash
cd /opt/superpalpite
docker compose up -d
```

sem interferir em nada já existente no servidor.

---

## 3. Stack Técnica Obrigatória

### Frontend e Backend

- Next.js 14+ com App Router
- TypeScript
- Tailwind CSS
- Mobile-first
- Mensagens em português brasileiro

### Banco, Auth, Storage e Realtime

- Supabase hosted
- PostgreSQL gerenciado
- Supabase Auth
- Supabase Realtime
- Supabase Storage para logos/assets, se necessário
- Row Level Security nativo
- Supabase CLI para migrations

### ORM/Query

- Supabase Client JS
- `anon key` somente no frontend
- `service role key` somente no servidor

### Pagamentos

- Mercado Pago SDK
- Pix com QR Code
- Webhook validado por assinatura
- Webhook idempotente

### Infraestrutura

- Docker
- Docker Compose isolado
- Nginx em container próprio do projeto ou proxy reverso existente, caso o usuário confirme
- SSL via Let's Encrypt, Certbot ou Nginx Proxy Manager existente

### Monitoramento

- Sentry opcional, free tier

### Relatórios

- `exceljs` para CSV/Excel

---

## 4. Por Que Usar Supabase, e Não Firebase

Para o **Super Palpite**, Supabase é mais indicado que Firebase porque o sistema envolve:

- Dinheiro real
- Pagamentos Pix
- Prêmios
- Histórico financeiro imutável
- Auditoria
- Relacionamentos fortes entre bolões, jogos, palpites, pagamentos e vencedores
- Cálculos financeiros com precisão decimal
- Regras de integridade, como impedir alteração de placar após pagamento

Com Supabase/PostgreSQL é possível usar:

- Tabelas relacionais
- `NUMERIC(10,2)` para valores financeiros
- Constraints
- Índices
- Transações
- RLS declarativo
- Realtime
- Migrations versionadas
- Auditoria e relatórios SQL

Com Firebase/Firestore, muitas dessas garantias dependeriam de lógica manual no código, o que aumenta risco e complexidade para um produto financeiro.

**Decisão técnica:** usar Supabase.

---

## 5. Identidade Visual

### Conceito

Visual esportivo, competitivo, moderno, profissional, confiável e popular.

### Cores principais

- Preto: `#0a0a0a`
- Branco: `#ffffff`
- Dourado/amarelo metálico: `#FFD700`
- Dourado escuro: `#F5A623`
- Cinza escuro: `#1a1a1a`
- Cinza médio: `#2a2a2a`

### Tipografia sugerida

- Inter Black
- Bebas Neue
- Barlow Condensed Bold

### Frase de apoio

> Palpites inteligentes. Resultados reais.

### Posicionamento

> Dê seu palpite no placar exato, pague via Pix e acompanhe os palpites confirmados em tempo real.

---

## 6. Descrição do Produto

O **Super Palpite** é uma aplicação web para bolões de placar exato em jogos de futebol.

Fluxo do usuário:

1. O usuário acessa a página de um jogo.
2. Escolhe o placar.
3. Informa seus dados.
4. Gera um Pix via Mercado Pago.
5. Paga dentro do prazo.
6. Após confirmação por webhook, o palpite se torna válido.
7. O palpite aparece na lista pública do jogo.
8. Após o resultado oficial, o sistema apura vencedores.
9. O prêmio é dividido entre quem acertou o placar exato.

O sistema também possui painel administrativo para:

- Criação de bolões
- Cadastro de jogos
- Definição do valor do bilhete
- Controle de palpites pagos
- Cálculo automático do prêmio atual
- Inserção do resultado final
- Apuração automática dos vencedores
- Marcação de prêmio pago
- Exportação CSV/Excel
- Auditoria de ações críticas

---

## 7. Regras de Negócio

### Divisão do bilhete

Por padrão:

- Taxa administrativa: `40%`
- Valor destinado à premiação: `60%`

O administrador pode editar a porcentagem da taxa administrativa antes de publicar o bolão.

Após publicado:

- Valores financeiros não podem ser alterados.
- O bolão pode apenas ser ativado/desativado/cancelado conforme regra administrativa.

### Regra de prêmio mínimo

- Bilhete `<= R$ 19,90` → prêmio mínimo = `bilhete × 20`
- Bilhete `> R$ 19,90` → prêmio mínimo = `bilhete × 10`

### Regra de prêmio atual

```ts
prêmio atual = MAX(prêmio mínimo, soma dos prize_contribution de palpites pagos)
```

Exemplo com bilhete de R$ 10,00:

- Taxa admin: R$ 4,00
- Para premiação: R$ 6,00
- Prêmio mínimo: R$ 200,00

Cenários:

- 10 palpites pagos → R$ 60,00 acumulado → exibe R$ 200,00
- 34 palpites pagos → R$ 204,00 acumulado → exibe R$ 204,00
- 35 palpites pagos → R$ 210,00 acumulado → exibe R$ 210,00

### Regras de participação

- Só concorrem palpites com pagamento confirmado.
- Palpite só é válido se pago antes do início da partida.
- Após pagamento, o placar não pode ser alterado.
- Vence quem acertar o placar exato.
- Em caso de empate no acerto, o prêmio é dividido igualmente.
- Se ninguém acertar, não há pagamento de prêmio.
- Pagamento do prêmio é feito via Pix usando a chave cadastrada pelo participante.
- Mais de um palpite por pessoa é permitido.
- Cada palpite gera um Pix separado.
- Participante deve ser maior de 18 anos.
- Participante deve aceitar os termos.
- Site não exibe telefone nem chave Pix publicamente.
- Lista pública exibe apenas nome abreviado e placar.
- Organizador pode cancelar palpites suspeitos, duplicados ou com dados falsos.

---

## 8. Funções Financeiras Obrigatórias

Criar o arquivo:

```txt
/opt/superpalpite/app/src/lib/financial.ts
```

Implementar:

```ts
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
```

Também implementar:

```ts
export async function recalculatePoolFinancials(poolId: string): Promise<void>
```

Essa função deve:

- Usar Supabase service role.
- Somar apenas palpites com `payment_status = 'approved'`.
- Atualizar no bolão:
  - `total_collected_amount`
  - `total_admin_fee_amount`
  - `total_prize_contribution_amount`
  - `paid_guesses_count`
  - `current_prize_amount`

---

## 9. Banco de Dados — Supabase/PostgreSQL

Criar migration:

```txt
/opt/superpalpite/app/supabase/migrations/001_initial.sql
```

### Regras gerais

- Usar `NUMERIC(10,2)` para valores financeiros.
- Nunca usar `FLOAT` para dinheiro.
- Ativar RLS em todas as tabelas.
- Dados sensíveis nunca devem ser retornados em APIs públicas.
- Realtime deve ser ativado em `pools` e `guesses`.
- Migrations versionadas via Supabase CLI.

### Tabela `games`

```sql
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
```

### Tabela `pools`

```sql
CREATE TABLE pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  game_id UUID REFERENCES games(id),
  ticket_amount NUMERIC(10,2) NOT NULL,
  admin_fee_percentage NUMERIC(5,2) NOT NULL DEFAULT 40,
  prize_percentage NUMERIC(5,2) NOT NULL DEFAULT 60,
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
```

### Tabela `guesses`

```sql
CREATE TABLE guesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID REFERENCES pools(id),
  game_id UUID REFERENCES games(id),
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  pix_key TEXT NOT NULL,
  home_score INTEGER NOT NULL,
  away_score INTEGER NOT NULL,
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
```

### Tabela `payments`

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guess_id UUID REFERENCES guesses(id),
  pool_id UUID REFERENCES pools(id),
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
```

### Tabela `winners`

```sql
CREATE TABLE winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID REFERENCES pools(id),
  game_id UUID REFERENCES games(id),
  guess_id UUID REFERENCES guesses(id),
  prize_share NUMERIC(10,2),
  paid_status TEXT DEFAULT 'pendente',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabela `admin_users`

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabela `audit_logs`

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Índices obrigatórios

Criar índices para:

- `pools.game_id`
- `pools.status`
- `games.match_date`
- `guesses.pool_id`
- `guesses.game_id`
- `guesses.payment_status`
- `guesses.mercado_pago_payment_id`
- `payments.guess_id`
- `payments.pool_id`
- `payments.mercado_pago_id`
- `winners.pool_id`
- `audit_logs.entity_type`
- `audit_logs.entity_id`

### RLS obrigatório

Ativar RLS em todas as tabelas.

Políticas mínimas:

- `pools`: `SELECT` público permitido.
- `games`: `SELECT` público permitido.
- `guesses`: `INSERT` público permitido para criar palpite.
- `guesses`: `SELECT` público apenas para palpites pagos, expondo somente dados seguros.
- `guesses`: `UPDATE` e `DELETE` apenas via service role.
- `payments`: apenas service role.
- `winners`: `SELECT` público permitido, sem dados pessoais.
- `audit_logs`: apenas service role.
- `admin_users`: apenas service role/admin autenticado.

> Observação técnica: como PostgreSQL RLS não limita colunas por policy, criar views públicas para exposição segura, por exemplo:
>
> - `public_paid_guesses`
> - `public_winners`

---

## 10. Estados do Sistema

### Bolão

- `aberto`
- `encerrado`
- `aguardando_resultado`
- `resultado_publicado`
- `premio_pago`
- `sem_ganhadores`
- `cancelado`

### Pagamento

- `pending`
- `approved`
- `rejected`
- `expired`
- `canceled`
- `refunded`

### Palpite

- `aguardando_pagamento`
- `pago_valido`
- `expirado`
- `cancelado`
- `vencedor`
- `perdedor`

---

## 11. Estrutura de Pastas Obrigatória

Gerar a seguinte estrutura:

```txt
/opt/superpalpite/
├── docker-compose.yml
├── .env
├── .env.example
├── .gitignore
├── README.md
├── nginx/
│   └── default.conf
└── app/
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.ts
    ├── postcss.config.js
    ├── supabase/
    │   └── migrations/
    │       └── 001_initial.sql
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── regulamento/
        │   │   └── page.tsx
        │   ├── bolao/
        │   │   └── [id]/
        │   │       └── page.tsx
        │   ├── admin/
        │   │   ├── layout.tsx
        │   │   ├── login/
        │   │   │   └── page.tsx
        │   │   ├── dashboard/
        │   │   │   └── page.tsx
        │   │   ├── boloes/
        │   │   │   ├── page.tsx
        │   │   │   ├── novo/
        │   │   │   │   └── page.tsx
        │   │   │   └── [id]/
        │   │   │       └── page.tsx
        │   │   ├── jogos/
        │   │   │   ├── page.tsx
        │   │   │   └── novo/
        │   │   │       └── page.tsx
        │   │   └── palpites/
        │   │       └── page.tsx
        │   └── api/
        │       ├── palpites/
        │       │   └── route.ts
        │       ├── webhooks/
        │       │   └── mercadopago/
        │       │       └── route.ts
        │       └── admin/
        │           ├── boloes/
        │           │   └── route.ts
        │           ├── jogos/
        │           │   └── route.ts
        │           ├── resultado/
        │           │   └── route.ts
        │           └── exportar/
        │               └── route.ts
        ├── components/
        │   ├── ui/
        │   │   ├── Button.tsx
        │   │   ├── Card.tsx
        │   │   ├── Badge.tsx
        │   │   ├── Input.tsx
        │   │   └── Modal.tsx
        │   ├── BolaoCard.tsx
        │   ├── PalpiteForm.tsx
        │   ├── PixPayment.tsx
        │   ├── ListaPalpites.tsx
        │   ├── CountdownTimer.tsx
        │   ├── PremioAtual.tsx
        │   └── admin/
        │       ├── BolaoForm.tsx
        │       ├── JogoForm.tsx
        │       ├── PalpitesTable.tsx
        │       └── FinancialSummary.tsx
        ├── hooks/
        │   ├── useRealtimePremio.ts
        │   └── useRealtimePalpites.ts
        ├── lib/
        │   ├── supabase/
        │   │   ├── client.ts
        │   │   └── server.ts
        │   ├── mercadopago/
        │   │   ├── client.ts
        │   │   └── pix.ts
        │   ├── financial.ts
        │   ├── validators.ts
        │   ├── rate-limit.ts
        │   └── utils.ts
        └── types/
            └── index.ts
```

---

## 12. Docker Compose Isolado

Criar:

```txt
/opt/superpalpite/docker-compose.yml
```

Com:

```yaml
networks:
  superpalpite_net:
    name: superpalpite_net

services:
  superpalpite_app:
    build: ./app
    container_name: superpalpite_app
    restart: unless-stopped
    ports:
      - "3010:3000"
    env_file: .env
    networks:
      - superpalpite_net

  superpalpite_nginx:
    image: nginx:alpine
    container_name: superpalpite_nginx
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./nginx:/etc/nginx/conf.d:ro
    depends_on:
      - superpalpite_app
    networks:
      - superpalpite_net
```

Antes de usar em produção, validar se as portas `3010` e `8080` estão livres.

---

## 13. Dockerfile do App

Criar:

```txt
/opt/superpalpite/app/Dockerfile
```

Requisitos:

- Build multi-stage.
- Next.js em produção.
- `npm ci`.
- `npm run build`.
- Rodar como usuário não-root, se possível.
- Expor porta `3000`.

---

## 14. Nginx

Criar:

```txt
/opt/superpalpite/nginx/default.conf
```

Requisitos:

- Proxy para `superpalpite_app:3000`.
- Headers corretos:
  - `Host`
  - `X-Real-IP`
  - `X-Forwarded-For`
  - `X-Forwarded-Proto`
- Suporte a WebSocket/Supabase Realtime se necessário.
- Não conflitar com proxies existentes.

---

## 15. Variáveis de Ambiente

Criar:

```txt
/opt/superpalpite/.env.example
```

Com:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=https://superpalpite.com.br
NEXTAUTH_SECRET=

# Admin inicial
ADMIN_EMAIL=
ADMIN_PASSWORD=

# Sentry opcional
SENTRY_DSN=
```

Nunca commitar `.env`.

---

## 16. Tipos TypeScript

Criar:

```txt
/opt/superpalpite/app/src/types/index.ts
```

Gerar interfaces completas para:

- `Pool`
- `Game`
- `Guess`
- `Payment`
- `Winner`
- `AuditLog`
- `AdminUser`

Gerar também enums/tipos union para:

- `PoolStatus`
- `PaymentStatus`
- `GuessStatus`
- `GameStatus`
- `WinnerPaidStatus`

Não usar `any`.

---

## 17. Supabase Clients

Criar:

```txt
/opt/superpalpite/app/src/lib/supabase/client.ts
```

Para browser/client components, usando:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Criar:

```txt
/opt/superpalpite/app/src/lib/supabase/server.ts
```

Para rotas server-side, usando:

- `SUPABASE_SERVICE_ROLE_KEY`

Regras:

- Service role nunca deve ser exposto no frontend.
- Validar envs obrigatórias.
- Mensagens claras de erro em ambiente mal configurado.

---

## 18. Mercado Pago

Criar:

```txt
/opt/superpalpite/app/src/lib/mercadopago/client.ts
/opt/superpalpite/app/src/lib/mercadopago/pix.ts
```

Implementar:

- Cliente Mercado Pago com `MERCADO_PAGO_ACCESS_TOKEN`.
- Função para criar cobrança Pix.
- Expiração configurável.
- Retorno de:
  - `mercado_pago_id`
  - `qr_code`
  - `qr_code_base64`
  - `copy_paste_code`
  - `expires_at`

Nunca hardcodar token.

---

## 19. Validações

Criar:

```txt
/opt/superpalpite/app/src/lib/validators.ts
```

Validações obrigatórias:

- Nome obrigatório.
- WhatsApp obrigatório e sanitizado.
- Chave Pix obrigatória.
- Placar casa e visitante inteiros entre `0` e `20`.
- Bolão precisa estar aberto.
- Jogo ainda não pode ter começado.
- Aceite dos termos obrigatório.
- Confirmação de maioridade obrigatória.
- Valor do pagamento precisa bater exatamente com snapshot do bilhete.

---

## 20. Rate Limit

Criar:

```txt
/opt/superpalpite/app/src/lib/rate-limit.ts
```

Aplicar rate limit em:

- `/api/palpites`
- `/api/webhooks/mercadopago`

Pode ser implementação simples em memória para MVP, documentando limitação em ambiente serverless/multi-instância.

---

## 21. API — Criar Palpite

Criar:

```txt
/opt/superpalpite/app/src/app/api/palpites/route.ts
```

Implementar método `POST`.

Fluxo obrigatório:

1. Receber dados do palpite.
2. Validar entrada.
3. Buscar bolão e jogo.
4. Validar bolão aberto.
5. Validar que `match_date` ainda não passou.
6. Calcular snapshots financeiros:
   - `ticket_amount_snapshot`
   - `admin_fee_amount_snapshot`
   - `prize_contribution_amount_snapshot`
7. Gerar `public_name` abreviado. Exemplo:
   - `João Silva` → `João S.`
8. Salvar palpite com:
   - `payment_status = 'pending'`
   - `status = 'aguardando_pagamento'`
9. Criar cobrança Pix Mercado Pago.
10. Salvar pagamento em `payments`.
11. Atualizar `mercado_pago_payment_id` no palpite.
12. Retornar:
   - `guess_id`
   - `payment_id`
   - `qr_code`
   - `qr_code_base64`
   - `copy_paste_code`
   - `expires_at`

---

## 22. API — Webhook Mercado Pago

Criar:

```txt
/opt/superpalpite/app/src/app/api/webhooks/mercadopago/route.ts
```

Implementar método `POST`.

Fluxo obrigatório:

1. Receber webhook.
2. Validar assinatura com header `X-Signature` e `MERCADO_PAGO_WEBHOOK_SECRET`.
3. Verificar idempotência:
   - Se pagamento já foi processado como `approved`, retornar `200` sem reprocessar.
4. Buscar detalhes do pagamento no Mercado Pago, se necessário.
5. Buscar `payment` por `mercado_pago_id`.
6. Buscar `guess`.
7. Validar valor pago:
   - Deve ser exatamente igual a `ticket_amount_snapshot`.
8. Validar que o jogo ainda não começou.
9. Se status Mercado Pago for `approved`:
   - Atualizar `payments.status = 'approved'`
   - Atualizar `guesses.payment_status = 'approved'`
   - Atualizar `guesses.status = 'pago_valido'`
   - Definir `paid_at = now()`
10. Chamar `recalculatePoolFinancials(poolId)`.
11. Salvar `raw_webhook_payload`.
12. Registrar em `audit_logs`.
13. Retornar `200`.

---

## 23. API — Inserir Resultado e Calcular Vencedores

Criar:

```txt
/opt/superpalpite/app/src/app/api/admin/resultado/route.ts
```

Implementar método `POST`.

Fluxo obrigatório:

1. Validar admin autenticado.
2. Receber:
   - `pool_id`
   - `home_score`
   - `away_score`
3. Buscar bolão e jogo.
4. Atualizar resultado em `games`.
5. Buscar todos os palpites com `payment_status = 'approved'`.
6. Filtrar vencedores com placar exato.
7. Se houver vencedores:
   - Dividir `current_prize_amount` igualmente.
   - Criar registros em `winners`.
   - Atualizar palpites vencedores para `status = 'vencedor'`.
   - Atualizar demais para `status = 'perdedor'`.
   - Atualizar bolão para `resultado_publicado`.
8. Se não houver vencedores:
   - Atualizar bolão para `sem_ganhadores`.
9. Registrar em `audit_logs`.
10. Retornar resumo da apuração.

---

## 24. API Admin

Criar rotas:

```txt
/api/admin/boloes/route.ts
/api/admin/jogos/route.ts
/api/admin/exportar/route.ts
```

Requisitos:

- Todas exigem autenticação admin.
- Validar role/metadata via Supabase Auth.
- CRUD de jogos.
- CRUD de bolões.
- Exportação CSV/Excel com `exceljs`.
- Logs de ações críticas em `audit_logs`.

---

## 25. Tailwind Config

Criar:

```txt
/opt/superpalpite/app/tailwind.config.ts
```

Com paleta:

```ts
colors: {
  sp: {
    black: '#0a0a0a',
    dark: '#1a1a1a',
    card: '#2a2a2a',
    gold: '#FFD700',
    'gold-dark': '#F5A623',
    white: '#ffffff',
    gray: '#888888',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
  }
}
```

---

## 26. Componentes Obrigatórios

### `BolaoCard.tsx`

Card da página inicial com:

- Times casa vs visitante.
- Competição.
- Data e horário.
- Badge de status.
- Valor do bilhete.
- Prêmio atual em dourado grande.
- Contador de palpites confirmados.
- Botão “Participar”.

### `PalpiteForm.tsx`

Formulário com:

- Seletor de placar com botões `+` e `-`.
- Campo nome.
- Campo WhatsApp.
- Campo chave Pix.
- Checkbox “Sou maior de 18 anos”.
- Checkbox “Li e aceito o regulamento”.
- Botão “Gerar Pix”.
- Estado loading.
- Estado erro.
- Estado sucesso.

### `PixPayment.tsx`

Componente pós-geração do Pix com:

- QR Code renderizado a partir do base64.
- Código copia e cola.
- Botão copiar.
- Countdown do prazo de pagamento.
- Status:
  - aguardando
  - confirmado
  - expirado
- Polling ou realtime para confirmação.

### `ListaPalpites.tsx`

Lista pública com:

- Apenas palpites com `payment_status = 'approved'`.
- Exibir:
  - `public_name`
  - placar
- Exemplo:
  - `João S. — 2x1`
- Atualização via Supabase Realtime.
- Contador total.

### `CountdownTimer.tsx`

Contador regressivo até início do jogo.

### `PremioAtual.tsx`

Valor do prêmio atual em destaque dourado, atualizado via Realtime.

### Componentes Admin

- `BolaoForm.tsx`
- `JogoForm.tsx`
- `PalpitesTable.tsx`
- `FinancialSummary.tsx`

---

## 27. Páginas Públicas

### Página inicial `/`

Requisitos:

- Cards dos bolões/jogos disponíveis.
- Times.
- Data e horário.
- Competição.
- Valor do bilhete.
- Prêmio atual.
- Quantidade de palpites pagos.
- Status do bolão com badge visual.
- Atualização do prêmio em tempo real via Supabase Realtime.
- Visual dark esportivo.

### Página individual do bolão `/bolao/[id]`

Requisitos:

- Dados completos do jogo.
- Prêmio mínimo.
- Prêmio atual em realtime.
- Contador de palpites confirmados em realtime.
- Horário de encerramento com countdown.
- Formulário de palpite.
- Geração de Pix.
- QR Code.
- Código Pix copia e cola.
- Status de pagamento.
- Lista pública de palpites pagos.

### Página de regulamento `/regulamento`

Deve conter:

- Como funciona o bolão.
- Divisão do bilhete.
- Regra do prêmio mínimo.
- Como o prêmio atual é calculado.
- Regras de participação.
- Regras de pagamento.
- Regras de premiação.
- Política de privacidade resumida.
- Aviso LGPD.
- Aviso jurídico.

Incluir aviso:

> Este produto envolve pagamento, prêmio e resultado esportivo. É necessária validação jurídica antes da operação pública.

---

## 28. Painel Administrativo

### `/admin/login`

- Login seguro via Supabase Auth.
- Mensagens de erro amigáveis.

### `/admin/dashboard`

Métricas gerais:

- Total de bolões.
- Palpites pagos.
- Total arrecadado.
- Total administrativo.
- Total destinado a prêmios.
- Bolões abertos.
- Bolões aguardando resultado.

### `/admin/jogos`

- Lista de jogos.
- Criar jogo.
- Editar jogo.
- Status do jogo.

### `/admin/boloes`

- Lista de bolões.
- Filtros por status.
- Métricas por bolão.

### `/admin/boloes/novo`

Formulário de criação:

- Selecionar jogo.
- Informar valor do bilhete.
- Definir taxa administrativa.
- Calcular automaticamente:
  - Taxa administrativa
  - Valor para premiação
  - Prêmio mínimo
- Botão publicar bolão.

### `/admin/boloes/[id]`

Detalhe do bolão:

- Total arrecadado.
- Total administrativo.
- Total para premiação.
- Prêmio atual.
- Palpites por status.
- Tabela de palpites.
- Botão inserir resultado final.
- Botão cancelar palpite suspeito.
- Botão exportar CSV/Excel.
- Botão marcar prêmio como pago.

---

## 29. Segurança Obrigatória

Implementar:

- Validação completa no backend.
- Nunca confiar só no frontend.
- Sanitização de entradas.
- Rate limit nas rotas sensíveis.
- Webhook Mercado Pago validado por assinatura.
- Webhook idempotente.
- Dados sensíveis protegidos.
- HTTPS obrigatório em produção.
- Segredos apenas em variáveis de ambiente.
- Painel admin protegido por Supabase Auth.
- Verificação de role admin.
- Auditoria de ações críticas em `audit_logs`.
- Conformidade LGPD:
  - aviso de coleta de dados
  - finalidade dos dados
  - política de privacidade resumida
- Não expor:
  - WhatsApp
  - chave Pix
  - payloads internos
  - service role key
  - tokens Mercado Pago

---

## 30. Integração Mercado Pago — Fluxo Pix

### Fluxo de geração do Pix

1. Backend recebe dados do palpite.
2. Valida bolão aberto.
3. Valida jogo não iniciado.
4. Valida dados do participante.
5. Salva palpite com `payment_status = 'pending'`.
6. Registra snapshots:
   - `ticket_amount_snapshot`
   - `admin_fee_amount_snapshot`
   - `prize_contribution_amount_snapshot`
7. Chama API Mercado Pago.
8. Cria pagamento Pix com valor do bilhete.
9. Define expiração configurável.
10. Salva:
   - `qr_code`
   - `qr_code_base64`
   - `copy_paste_code`
11. Retorna QR Code para frontend.

### Fluxo do webhook

1. Mercado Pago envia POST para `/api/webhooks/mercadopago`.
2. Backend valida assinatura.
3. Verifica idempotência.
4. Busca palpite por `mercado_pago_payment_id`.
5. Valida valor pago.
6. Valida que jogo ainda não começou.
7. Se aprovado:
   - `payment_status = 'approved'`
   - `status = 'pago_valido'`
   - `paid_at = now()`
8. Recalcula financeiro.
9. Salva log e payload.
10. Retorna `200`.

---

## 31. Fluxo Principal do Usuário

1. Acessa página inicial.
2. Vê cards de bolões.
3. Clica no bolão.
4. Vê página do jogo.
5. Preenche placar e dados pessoais.
6. Aceita termos.
7. Confirma maioridade.
8. Clica em “Gerar Pix”.
9. Sistema cria palpite pendente.
10. Sistema gera cobrança Pix.
11. Usuário paga.
12. Webhook confirma.
13. Palpite vira público.
14. Após o jogo, admin insere resultado.
15. Sistema calcula vencedores.
16. Admin paga prêmio e marca como pago.

---

## 32. Fluxo Administrativo

1. Admin faz login.
2. Cria jogo.
3. Cria bolão.
4. Informa valor do bilhete.
5. Sistema calcula:
   - taxa administrativa
   - contribuição para prêmio
   - prêmio mínimo
6. Admin publica bolão.
7. Admin acompanha palpites e financeiro.
8. Após o jogo, insere resultado final.
9. Sistema calcula vencedores.
10. Admin paga via Pix.
11. Admin marca prêmio como pago.
12. Admin exporta relatórios.

---

## 33. QA — Casos de Teste Obrigatórios

Implementar ou documentar testes para:

- Cálculo correto de 40%/60%.
- Prêmio mínimo para bilhetes `<= R$ 19,90`.
- Prêmio mínimo para bilhetes `> R$ 19,90`.
- Prêmio atual exibe mínimo enquanto acumulado for menor.
- Prêmio atual cresce após acumulado superar mínimo.
- Histórico financeiro do palpite não muda se bolão mudar.
- Webhook duplicado processado apenas uma vez.
- Palpite expirado não aparece na lista pública.
- Tentativa de alterar placar após pagamento é bloqueada.
- Tentativa de palpite em bolão encerrado é bloqueada.
- Tentativa de palpite após início do jogo é bloqueada.
- Webhook com valor diferente do bilhete é rejeitado.
- Dois vencedores dividem o prêmio corretamente.
- Nenhum vencedor define status `sem_ganhadores`.
- Dados sensíveis não aparecem em API pública.
- Rate limit funciona nas rotas sensíveis.
- RLS impede acesso indevido.
- Admin sem role não acessa painel.
- Exportação CSV/Excel funciona.

---

## 34. Dependências Sugeridas

No `package.json`, incluir dependências como:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "latest",
    "mercadopago": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "zod": "latest",
    "exceljs": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "lucide-react": "latest",
    "date-fns": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "typescript": "latest",
    "tailwindcss": "latest",
    "postcss": "latest",
    "autoprefixer": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest"
  }
}
```

---

## 35. Ordem de Entrega Obrigatória

Entregar nesta ordem:

1. Estrutura de pastas e arquivos base.
2. `docker-compose.yml` isolado.
3. `.env.example`.
4. `.gitignore`.
5. Migration SQL completa para Supabase com RLS.
6. `src/types/index.ts`.
7. `src/lib/financial.ts`.
8. Supabase clients.
9. Mercado Pago client/Pix.
10. Validators.
11. Rate limit.
12. Tailwind config.
13. Layout raiz.
14. Página inicial.
15. Página do bolão.
16. Página de regulamento.
17. Componentes públicos.
18. Hooks realtime.
19. API `/api/palpites`.
20. API webhook Mercado Pago.
21. API admin resultado.
22. APIs admin bolões/jogos/exportação.
23. Painel admin completo.
24. Dockerfile do app.
25. Nginx config.
26. README com setup e deploy.
27. Checklist de QA.

---

## 36. README Obrigatório

Criar `README.md` com:

- Visão geral do projeto.
- Stack utilizada.
- Pré-requisitos.
- Como criar pasta `/opt/superpalpite`.
- Como configurar `.env`.
- Como rodar migrations Supabase.
- Como subir com Docker.
- Como verificar logs.
- Como configurar Mercado Pago webhook.
- Como configurar domínio/SSL.
- Como acessar admin.
- Checklist de segurança.
- Checklist de deploy.
- Aviso jurídico.

---

## 37. Comandos de Setup Inicial

Gerar comandos como:

```bash
sudo mkdir -p /opt/superpalpite
sudo chown -R "$USER":"$USER" /opt/superpalpite
cd /opt/superpalpite

docker ps
ss -tlnp
```

Depois de criar arquivos:

```bash
cp .env.example .env
# editar .env com credenciais reais

docker compose build
docker compose up -d
docker compose logs -f
```

---

## 38. Regras Finais de Implementação

- Código limpo.
- TypeScript estrito.
- Não usar `any`.
- Tratar erros.
- Validar tudo no backend.
- Comentários em português nos pontos críticos.
- Interface em português brasileiro.
- Mobile-first.
- Dark theme.
- Destaques dourados.
- Nunca hardcodar segredos.
- Não expor dados sensíveis.
- Preservar snapshots financeiros.
- Não recalcular retroativamente valores de palpites antigos.
- Usar `NUMERIC(10,2)` no banco.
- Usar `toFixed(2)` e `Number()` no TypeScript para cálculos do MVP.
- Documentar hipóteses.
- Entregar arquivos com caminho exato.
- Priorizar produção, não apenas protótipo.

---

## 39. Objetivo Final

Construir o **Super Palpite** como aplicação web profissional para bolões de placar exato, com:

- Pix via Mercado Pago
- Painel administrativo
- Cálculo automático de taxas
- Cálculo automático de premiação
- Prêmio mínimo
- Prêmio atual dinâmico
- Apuração automática de vencedores
- Lista pública de palpites pagos
- Regulamento claro
- Segurança
- Privacidade
- Estrutura Docker isolada
- Pronto para rodar em servidor Debian
- Sem interferir em containers já existentes
- Usando Supabase para acelerar a entrega

---

## 40. Pedido Direto ao Codex/GPT

Implemente agora o projeto completo seguindo exatamente este prompt.

Para cada arquivo criado, informe:

1. Caminho exato do arquivo.
2. Conteúdo completo do arquivo.
3. Dependências necessárias.
4. Comandos para executar.
5. Observações de segurança.
6. Próximos passos de deploy.

Não entregue apenas explicações. Entregue código completo, organizado, funcional e pronto para evolução.
