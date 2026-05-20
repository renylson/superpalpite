'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle, Copy, RefreshCw, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SimpleCountdown } from '@/components/SimpleCountdown';

export interface PixPaymentData {
  payment_id: string;
  guess_id: string;
  comprovante_key: string;
  qr_code: string;
  qr_code_base64: string;
  copy_paste_code: string;
  expires_at: string;
}

type PaymentStatus = 'pending' | 'in_process' | 'approved' | 'expired' | 'rejected' | string;

export function PixPayment({ payment }: { payment: PixPaymentData }) {
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>('pending');
  const [comprovanteKey, setComprovanteKey] = useState<string>(payment.comprovante_key ?? '');
  const [message, setMessage] = useState('Escaneie o QR Code ou copie o código abaixo.');

  const checkPayment = useCallback(async () => {
    setChecking(true);
    try {
      const response = await fetch(`/api/pagamentos/${payment.payment_id}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Não foi possível verificar o pagamento.');
      setStatus(payload.status);
      if (payload.comprovante_key) setComprovanteKey(payload.comprovante_key);
      if (payload.paid) {
        setMessage('Pagamento confirmado! Seu palpite está registrado.');
      } else if (payload.status === 'pending' || payload.status === 'in_process') {
        setMessage('A confirmação pode levar alguns instantes após o pagamento.');
      } else if (payload.status === 'expired') {
        setMessage('Este Pix expirou. Gere um novo palpite para participar.');
      } else if (payload.status === 'rejected') {
        setMessage('Pagamento recusado. Gere um novo palpite para tentar novamente.');
      } else {
        setMessage(`Status: ${payload.status}.`);
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
    }, 8_000);
    return () => window.clearInterval(interval);
  }, [checkPayment, status]);

  async function copy() {
    await navigator.clipboard.writeText(payment.copy_paste_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  const isDone = status === 'approved' || status === 'expired' || status === 'rejected';

  // Tela de comprovante após aprovação
  if (status === 'approved') {
    const url = `${window.location.origin}/comprovante/${comprovanteKey}`;
    const waText = encodeURIComponent(
      `✅ *Meu comprovante de palpite — Super Palpite*\n\nChave: ${comprovanteKey}\n\n🔗 ${url}`
    );
    return (
      <div className="space-y-5 text-center">
        <div className="flex flex-col items-center gap-2">
          <CheckCircle size={52} className="text-emerald-400" />
          <h3 className="text-xl font-black text-emerald-300">Pagamento confirmado!</h3>
          <p className="text-sm text-zinc-400">{message}</p>
        </div>

        <div className="rounded-xl border border-sp-gold/30 bg-sp-gold/5 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Chave de validação</p>
          <p className="mt-1 text-2xl font-black tracking-widest text-sp-gold">{comprovanteKey}</p>
        </div>

        <a
          href={`/comprovante/${comprovanteKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 w-full items-center justify-center rounded-lg bg-sp-gold font-black text-sp-black transition hover:brightness-110"
        >
          Ver comprovante completo
        </a>

        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-emerald-700 bg-emerald-950/30 font-bold text-emerald-400 transition hover:bg-emerald-950/50"
        >
          <span>Compartilhar no WhatsApp</span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Banner de status */}
      <div className={`flex items-center gap-3 rounded-xl border p-4 ${
        status === 'expired' || status === 'rejected'
          ? 'border-red-800 bg-red-950'
          : 'border-zinc-700 bg-zinc-800/50'
      }`}>
        {status === 'expired' || status === 'rejected' ? (
          <XCircle size={24} className="shrink-0 text-red-400" />
        ) : (
          <Clock size={24} className="shrink-0 animate-pulse text-sp-gold" />
        )}
        <div>
          <p className={`font-black ${status === 'expired' || status === 'rejected' ? 'text-red-300' : 'text-zinc-200'}`}>
            {status === 'expired' ? 'Pix expirado' : status === 'rejected' ? 'Pagamento recusado' : 'Aguardando pagamento'}
          </p>
          <p className="text-sm text-zinc-400">{message}</p>
        </div>
      </div>

      {status !== 'expired' && status !== 'rejected' && (
        <>
          {payment.qr_code_base64 && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-bold text-zinc-300">1. Escaneie o QR Code no app do banco:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="h-52 w-52 rounded-xl border-4 border-white bg-white p-1"
                src={`data:image/png;base64,${payment.qr_code_base64}`}
                alt="QR Code Pix"
              />
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-bold text-zinc-300">2. Ou copie o código Pix copia e cola:</p>
            <div className="relative">
              <textarea
                className="h-24 w-full resize-none rounded-xl border border-zinc-700 bg-sp-black p-3 pr-12 text-xs text-zinc-300 focus:border-sp-gold focus:outline-none"
                readOnly
                value={payment.copy_paste_code}
              />
              <button
                type="button"
                onClick={copy}
                className="absolute right-2 top-2 rounded-lg border border-zinc-700 bg-zinc-800 p-2 text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
              >
                <Copy size={16} />
              </button>
            </div>
            <Button type="button" onClick={copy} className="mt-2 w-full">
              {copied ? '✅ Código copiado!' : 'Copiar código Pix'}
            </Button>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-sp-black/40 p-3 text-center">
            <p className="text-xs text-zinc-500">Expira em</p>
            <p className="mt-0.5 font-bold"><SimpleCountdown expiresAt={payment.expires_at} /></p>
          </div>
        </>
      )}

      {!isDone && (
        <Button type="button" variant="secondary" onClick={checkPayment} disabled={checking} className="w-full">
          <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
          <span className="ml-2">{checking ? 'Verificando...' : 'Verificar pagamento'}</span>
        </Button>
      )}
    </div>
  );
}
