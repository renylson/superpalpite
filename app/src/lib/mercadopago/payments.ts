export interface MercadoPagoPaymentDetails {
  id: number | string;
  status: string;
  transaction_amount: number;
}

export async function getMercadoPagoPaymentDetails(paymentId: string) {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) throw new Error('Mercado Pago não configurado.');
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Não foi possível consultar pagamento no Mercado Pago.');
  return response.json() as Promise<MercadoPagoPaymentDetails>;
}
