# Super Palpite

Aplicação web para bolões de placar exato em jogos de futebol, com Pix via Mercado Pago, painel administrativo, cálculo automático de taxas/premiação e Supabase hosted.

## Stack

- Next.js App Router, TypeScript e Tailwind CSS
- Supabase hosted: PostgreSQL, Auth, RLS e Realtime
- Mercado Pago Pix
- Docker Compose isolado na rede `superpalpite_net`
- Nginx Proxy Manager existente para domínio e SSL

## Estrutura

- `app/`: aplicação Next.js
- `app/supabase/migrations/001_initial.sql`: schema inicial, índices, RLS e views públicas
- `docker-compose.yml`: publica o app em `3010:3000`
- `.env.example`: modelo de configuração sem segredos
- `projeto_superpalpite.md`: documento original preservado

## Setup

```bash
cd /root/superpalpite
cp .env.example .env
```

Preencha no `.env`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MERCADO_PAGO_ACCESS_TOKEN`
- `MERCADO_PAGO_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

## Supabase

1. Crie um projeto hosted no Supabase.
2. Rode a migration `app/supabase/migrations/001_initial.sql` pelo SQL Editor ou Supabase CLI.
3. Crie o usuário admin no Supabase Auth.
4. Insira o mesmo e-mail na tabela `admin_users` com `role = 'admin'`.
5. Ative Realtime para `pools` e `guesses` se a publication não for aplicada automaticamente.

## Desenvolvimento

```bash
cd /root/superpalpite/app
npm install
npm run dev
```

## Docker

As portas atuais do servidor já usam `80`, `443`, `81`, `8080`, `8000`, `8443` e `7573-7577`. Por isso o Compose publica apenas:

- `3010 -> 3000`

```bash
cd /root/superpalpite
docker compose build
docker compose up -d
docker compose logs -f superpalpite_app
```

No Nginx Proxy Manager existente, crie um Proxy Host apontando para:

```txt
http://127.0.0.1:3010
```

Depois habilite SSL via Let's Encrypt.

## Mercado Pago

Configure o webhook no painel do Mercado Pago apontando para:

```txt
https://seu-dominio/api/webhooks/mercadopago
```

O backend valida assinatura, consulta o pagamento, rejeita valor divergente, evita reprocessar pagamentos aprovados e recalcula o financeiro do bolão.

## Segurança

- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend.
- Nunca commite `.env`.
- Views públicas não expõem WhatsApp, chave Pix ou payloads internos.
- APIs admin exigem Bearer token de usuário Supabase com e-mail cadastrado em `admin_users`.
- Valide juridicamente a operação antes de uso público, pois envolve pagamento, prêmio e resultado esportivo.

## QA

```bash
cd /root/superpalpite/app
npm run test
npm run lint
npm run build
```

Casos cobertos/documentados:

- Cálculo 40%/60%
- Prêmio mínimo para bilhete até/acima de R$ 19,90
- Prêmio atual com mínimo e crescimento por acumulado
- Divisão entre vencedores
- Webhook idempotente
- Bloqueio de palpite após início do jogo
- Rejeição de pagamento com valor divergente
- Dados sensíveis fora das views públicas
- RLS ativado nas tabelas principais

