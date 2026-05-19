'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CountdownTimer } from '@/components/CountdownTimer';

export interface PixPaymentData {
  payment_id: string;
  qr_code: string;
  qr_code_base64: string;
  copy_paste_code: string;
  expires_at: string;
}

export function PixPayment({ payment }: { payment: PixPaymentData }) {
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Aguardando confirmação do pagamento.');

  const checkPayment = useCallback(async () => {
    setChecking(true);
    try {
      const response = await fetch(`/api/pagamentos/${payment.payment_id}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Não foi possível verificar o pagamento.');
      setStatus(payload.status);
      if (payload.paid) {
        setMessage('Pagamento confirmado. Seu palpite já está concorrendo.');
      } else if (payload.status === 'pending' || payload.status === 'in_process') {
        setMessage('Pagamento ainda não confirmado. A confirmação pode levar alguns instantes.');
      } else if (payload.status === 'expired') {
        setMessage('Este Pix expirou. Gere um novo palpite para participar.');
      } else {
        setMessage(`Status do pagamento: ${payload.status}.`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao verificar pagamento.');
    } finally {
      setChecking(false);
    }
  }, [payment.payment_id]);

  useEffect(() => {
    void checkPayment();
    const interval = window.setInterval(() => {
      if (status !== 'approved' && status !== 'expired' && status !== 'rejected') {
        void checkPayment();
      }
    }, 10_000);
    return () => window.clearInterval(interval);
  }, [checkPayment, status]);

  async function copy() {
    await navigator.clipboard.writeText(payment.copy_paste_code);
    setCopied(true);
  }
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm uppercase text-zinc-400">Pix gerado</p>
        <h2 className="text-2xl font-black">Aguardando pagamento</h2>
      </div>
      <p className={status === 'approved' ? 'rounded-md bg-emerald-950 p-3 text-sm text-emerald-100' : 'rounded-md bg-sp-black p-3 text-sm text-zinc-200'}>
        {message}
      </p>
      {payment.qr_code_base64 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="mx-auto h-56 w-56 rounded-md bg-white p-2" src={`data:image/png;base64,${payment.qr_code_base64}`} alt="QR Code Pix" />
      ) : null}
      <textarea className="h-28 w-full rounded-md border border-zinc-700 bg-sp-black p-3 text-sm" readOnly value={payment.copy_paste_code} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" onClick={copy}>{copied ? 'Copiado' : 'Copiar código Pix'}</Button>
        <Button type="button" variant="secondary" onClick={checkPayment} disabled={checking || status === 'approved'}>
          {checking ? 'Verificando...' : status === 'approved' ? 'Pagamento confirmado' : 'Verificar pagamento'}
        </Button>
      </div>
      <p className="text-sm text-zinc-300">Expira em <CountdownTimer matchDate={payment.expires_at} /></p>
    </div>
  );
}
