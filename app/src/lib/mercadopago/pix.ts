import { Payment } from 'mercadopago';
import { getMercadoPagoClient } from '@/lib/mercadopago/client';

interface CreatePixInput {
  amount: number;
  description: string;
  payerName: string;
  payerEmail?: string;
  externalReference: string;
  expiresInMinutes?: number;
}

export interface PixCharge {
  mercado_pago_id: string;
  qr_code: string;
  qr_code_base64: string;
  copy_paste_code: string;
  expires_at: string;
}

interface MercadoPagoPixPoint {
  transaction_data?: {
    qr_code?: string;
    qr_code_base64?: string;
    ticket_url?: string;
  };
}

export async function createPixCharge(input: CreatePixInput): Promise<PixCharge> {
  const expiresAt = new Date(Date.now() + (input.expiresInMinutes ?? 30) * 60_000);
  const payment = new Payment(getMercadoPagoClient());
  try {
    const response = await payment.create({
      body: {
        transaction_amount: input.amount,
        description: input.description,
        payment_method_id: 'pix',
        external_reference: input.externalReference,
        date_of_expiration: expiresAt.toISOString(),
        payer: {
          first_name: input.payerName,
          email: input.payerEmail || 'participante@superpalpite.com.br',
        },
      },
    });

    const point = response.point_of_interaction as MercadoPagoPixPoint | undefined;
    const qrCode = point?.transaction_data?.qr_code ?? '';
    const qrCodeBase64 = point?.transaction_data?.qr_code_base64 ?? '';
    if (!response.id || !qrCode) {
      throw new Error('Mercado Pago não retornou o QR Code Pix.');
    }
    return {
      mercado_pago_id: String(response.id),
      qr_code: qrCode,
      qr_code_base64: qrCodeBase64,
      copy_paste_code: qrCode,
      expires_at: expiresAt.toISOString(),
    };
  } catch (error) {
    console.error('Erro ao criar Pix no Mercado Pago', error);
    throw new Error('Não foi possível gerar o Pix. Verifique a configuração do Mercado Pago e tente novamente.');
  }
}

export function validateMercadoPagoSignature(headers: Headers): boolean {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) return false;
  const signature = headers.get('x-signature');
  return Boolean(signature && signature.includes(secret));
}
