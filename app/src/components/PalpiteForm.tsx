'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PixPayment, type PixPaymentData } from '@/components/PixPayment';

export function PalpiteForm({ poolId }: { poolId: string }) {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [payment, setPayment] = useState<PixPaymentData | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/palpites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pool_id: poolId,
          nome: formData.get('nome'),
          whatsapp: formData.get('whatsapp'),
          pix_key: formData.get('pix_key'),
          home_score: homeScore,
          away_score: awayScore,
          accepted_terms: formData.get('accepted_terms') === 'on',
          is_adult: formData.get('is_adult') === 'on',
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Não foi possível gerar o Pix.');
      setPayment(payload);
      setPaymentModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form action={submit} className="space-y-4 rounded-lg border border-zinc-800 bg-sp-dark p-4">
        <h2 className="text-2xl font-black">Faça seu palpite</h2>
        <div className="grid grid-cols-2 gap-4">
          {[['Casa', homeScore, setHomeScore], ['Visitante', awayScore, setAwayScore]].map(([label, value, setter]) => (
            <div key={String(label)} className="rounded-md bg-sp-black p-3 text-center">
              <p className="text-sm text-zinc-400">{String(label)}</p>
              <div className="mt-2 flex items-center justify-center gap-3">
                <Button type="button" variant="secondary" onClick={() => (setter as (v: number) => void)(Math.max(0, Number(value) - 1))}>-</Button>
                <strong className="w-10 text-3xl">{Number(value)}</strong>
                <Button type="button" variant="secondary" onClick={() => (setter as (v: number) => void)(Math.min(20, Number(value) + 1))}>+</Button>
              </div>
            </div>
          ))}
        </div>
        <Input name="nome" placeholder="Nome completo" required />
        <Input name="whatsapp" placeholder="WhatsApp" required />
        <Input name="pix_key" placeholder="Chave Pix para receber prêmio" required />
        <label className="flex gap-3 text-sm text-zinc-300"><input name="is_adult" type="checkbox" /> Sou maior de 18 anos.</label>
        <label className="flex gap-3 text-sm text-zinc-300"><input name="accepted_terms" type="checkbox" /> Li e aceito o regulamento.</label>
        {error ? <p className="rounded-md bg-red-950 p-3 text-sm text-red-200">{error}</p> : null}
        <Button className="w-full" disabled={loading}>{loading ? 'Gerando Pix...' : 'Gerar Pix'}</Button>
      </form>
      {payment ? (
        <div className="mt-4 rounded-lg border border-sp-gold/30 bg-sp-dark p-4">
          <p className="text-sm text-zinc-300">Pix gerado para este palpite.</p>
          <Button type="button" className="mt-3 w-full" onClick={() => setPaymentModalOpen(true)}>Abrir pagamento</Button>
        </div>
      ) : null}
      <Modal open={Boolean(payment && paymentModalOpen)} title="Pagamento via Pix" onClose={() => setPaymentModalOpen(false)}>
        {payment ? <PixPayment payment={payment} /> : null}
      </Modal>
    </>
  );
}
