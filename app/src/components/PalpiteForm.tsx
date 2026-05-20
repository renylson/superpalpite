'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PixPayment, type PixPaymentData } from '@/components/PixPayment';

function ScoreSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{label}</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-700 active:scale-95"
        >
          <Minus size={16} />
        </button>
        <span className="w-12 text-center text-5xl font-black tabular-nums text-sp-white">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(20, value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-700 active:scale-95"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

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
      <form action={submit} className="space-y-5 rounded-xl border border-zinc-800 bg-sp-dark p-5">
        <div>
          <h2 className="text-xl font-black">Faça seu palpite</h2>
          <p className="mt-1 text-sm text-zinc-400">Escolha o placar que você acredita que vai sair.</p>
        </div>

        {/* Seletor de placar */}
        <div className="rounded-xl border border-zinc-800 bg-sp-black/60 p-5">
          <div className="flex items-center justify-between">
            <ScoreSelector label="Casa" value={homeScore} onChange={setHomeScore} />
            <span className="text-2xl font-black text-zinc-600">×</span>
            <ScoreSelector label="Visitante" value={awayScore} onChange={setAwayScore} />
          </div>
          <p className="mt-3 text-center text-xs text-zinc-600">
            Placar selecionado: {homeScore} × {awayScore}
          </p>
        </div>

        {/* Dados pessoais */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-zinc-300">Seus dados</p>
          <Input name="nome" placeholder="Nome completo" required />
          <Input name="whatsapp" placeholder="WhatsApp (ex: 11999999999)" required />
          <Input name="pix_key" placeholder="Chave Pix para receber o prêmio" required />
          <p className="text-xs text-zinc-600">
            Sua chave Pix é usada apenas para pagar o prêmio caso você ganhe. Não é exibida publicamente.
          </p>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-300">
            <input
              name="is_adult"
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-zinc-600 accent-sp-gold"
            />
            <span>Confirmo que sou maior de 18 anos.</span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-300">
            <input
              name="accepted_terms"
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-zinc-600 accent-sp-gold"
            />
            <span>
              Li e aceito o{' '}
              <a href="/regulamento" target="_blank" className="text-sp-gold underline">
                regulamento
              </a>
              .
            </span>
          </label>
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <Button className="w-full text-base" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-sp-black/30 border-t-sp-black" />
              Gerando Pix...
            </span>
          ) : (
            '⚡ Gerar Pix e participar'
          )}
        </Button>
      </form>

      {payment && (
        <div className="mt-3 rounded-xl border border-sp-gold/30 bg-sp-dark p-4">
          <p className="text-sm font-bold text-sp-gold">✅ Pix gerado com sucesso!</p>
          <p className="mt-1 text-xs text-zinc-400">Clique abaixo para abrir o QR Code e finalizar o pagamento.</p>
          <Button type="button" className="mt-3 w-full" onClick={() => setPaymentModalOpen(true)}>
            Abrir pagamento Pix
          </Button>
        </div>
      )}

      <Modal open={Boolean(payment && paymentModalOpen)} title="Pagamento via Pix" onClose={() => setPaymentModalOpen(false)}>
        {payment ? <PixPayment payment={payment} /> : null}
      </Modal>
    </>
  );
}
