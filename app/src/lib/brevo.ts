const BREVO_API_KEY = process.env.BREVO_API_KEY ?? '';
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL ?? 'noreply@superpalpite.com.br';
const BREVO_SENDER_NAME = 'Super Palpite';

export async function sendEmail(to: { email: string; name: string }, subject: string, html: string) {
  if (!BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY não configurada. Adicione a chave no .env e faça rebuild.');
  }
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
      to: [to],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo retornou ${res.status}: ${body}`);
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDateBR(iso: string) {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} às ${pad(d.getHours())}h${pad(d.getMinutes())}`;
}

export interface ComprovantePalpiteData {
  nome: string;
  email: string;
  homeTeam: string;
  awayTeam: string;
  competition: string | null;
  matchDate: string;
  homeScore: number;
  awayScore: number;
  ticketAmount: number;
  currentPrize: number;
  poolTitle: string;
}

export function buildComprovante(data: ComprovantePalpiteData): string {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#111111;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;border-radius:16px;overflow:hidden;border:1px solid #2a2a2a;">

      <!-- Cabeçalho -->
      <tr>
        <td style="background:#0a0a0a;padding:28px 40px;text-align:center;border-bottom:1px solid #2a2a2a;">
          <p style="margin:0;color:#FFD700;font-size:26px;font-weight:900;letter-spacing:3px;text-transform:uppercase;">SUPER PALPITE</p>
          <p style="margin:6px 0 0;color:#555;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;">Palpites Inteligentes. Resultados Reais.</p>
        </td>
      </tr>

      <!-- Banner confirmação -->
      <tr>
        <td style="background:#FFD700;padding:14px 40px;text-align:center;">
          <p style="margin:0;color:#0a0a0a;font-size:17px;font-weight:900;">✅ Pagamento Confirmado!</p>
        </td>
      </tr>

      <!-- Corpo -->
      <tr>
        <td style="background:#1a1a1a;padding:32px 40px;">

          <p style="margin:0 0 8px;color:#cccccc;font-size:15px;">Olá, <strong style="color:#ffffff;">${data.nome.split(' ')[0]}</strong>!</p>
          <p style="margin:0 0 28px;color:#888;font-size:14px;line-height:1.6;">Seu palpite foi registrado e o pagamento confirmado. Boa sorte! 🍀</p>

          <!-- Jogo -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #2a2a2a;border-radius:12px;margin-bottom:16px;">
            <tr>
              <td style="padding:20px;text-align:center;">
                <p style="margin:0 0 6px;color:#555;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;">${data.competition || 'Futebol'}</p>
                <p style="margin:0;color:#ffffff;font-size:20px;font-weight:900;">${data.homeTeam} <span style="color:#444;">×</span> ${data.awayTeam}</p>
                <p style="margin:8px 0 0;color:#666;font-size:12px;">${formatDateBR(data.matchDate)}</p>
              </td>
            </tr>
          </table>

          <!-- Palpite -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1500,#0a0a0a);border:1px solid #FFD70033;border-radius:12px;margin-bottom:16px;">
            <tr>
              <td style="padding:24px;text-align:center;">
                <p style="margin:0 0 8px;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;">Seu Palpite</p>
                <p style="margin:0;color:#FFD700;font-size:44px;font-weight:900;letter-spacing:8px;">${data.homeScore} × ${data.awayScore}</p>
                <p style="margin:10px 0 0;color:#666;font-size:12px;">${data.homeTeam} × ${data.awayTeam}</p>
              </td>
            </tr>
          </table>

          <!-- Detalhes financeiros -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #2a2a2a;border-radius:12px;margin-bottom:24px;">
            <tr>
              <td style="padding:14px 20px;border-bottom:1px solid #1a1a1a;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color:#888;font-size:13px;">Valor pago</td>
                    <td align="right" style="color:#ffffff;font-size:13px;font-weight:700;">${formatBRL(data.ticketAmount)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color:#888;font-size:13px;">Prêmio atual do bolão</td>
                    <td align="right" style="color:#FFD700;font-size:15px;font-weight:900;">${formatBRL(data.currentPrize)}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p style="margin:0;color:#666;font-size:12px;line-height:1.7;text-align:center;">
            Se acertar o placar exato, o prêmio será dividido igualmente entre todos os acertadores<br>e pago via Pix na chave cadastrada.
          </p>

        </td>
      </tr>

      <!-- Rodapé -->
      <tr>
        <td style="background:#0a0a0a;padding:20px 40px;text-align:center;border-top:1px solid #2a2a2a;">
          <p style="margin:0 0 6px;color:#444;font-size:11px;">
            Seus dados são protegidos conforme a <strong style="color:#555;">LGPD (Lei 13.709/2018)</strong>.
          </p>
          <p style="margin:0;color:#333;font-size:10px;">© ${year} Super Palpite. Todos os direitos reservados.</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}
