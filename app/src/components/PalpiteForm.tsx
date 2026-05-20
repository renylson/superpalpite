'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PixPayment, type PixPaymentData } from '@/components/PixPayment';
import {
  formatCPF,
  validateCPF,
  formatPhone,
  rawPhone,
  formatName,
  validateEmail,
  validatePhone,
} from '@/lib/masks';

type PixType = 'email' | 'cpf' | 'telefone';

function ScoreSelector({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="max-w-[100px] truncate text-center text-xs font-bold uppercase tracking-wider text-zinc-400">{label}</p>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-700 active:scale-95">
          <Minus size={16} />
        </button>
        <span className="w-12 text-center text-5xl font-black tabular-nums text-sp-white">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(20, value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-700 active:scale-95">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export function PalpiteForm({ poolId, homeTeam, awayTeam }: { poolId: string; homeTeam?: string; awayTeam?: string }) {
  // CPF lookup step
  const [step, setStep] = useState<'cpf' | 'form'>('cpf');
  const [cpfInput, setCpfInput] = useState('');
  const [cpfLooking, setCpfLooking] = useState(false);
  const [cpfError, setCpfError] = useState('');
  const [participantExists, setParticipantExists] = useState(false);
  const [lookupMessage, setLookupMessage] = useState<{ type: 'found' | 'new'; text: string } | null>(null);

  // Form fields
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [pixType, setPixType] = useState<PixType>('cpf');
  const [pixKey, setPixKey] = useState('');

  // Score
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  // Submit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [payment, setPayment] = useState<PixPaymentData | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Validation
  const cpfInputValid = validateCPF(cpfInput);
  function getPixKeyError(): string {
    if (!pixKey) return '';
    if (pixType === 'email' && !validateEmail(pixKey)) return 'E-mail inválido.';
    if (pixType === 'cpf' && !validateCPF(pixKey)) return 'CPF inválido.';
    if (pixType === 'telefone' && !validatePhone(pixKey)) return 'Telefone inválido.';
    return '';
  }
  const emailError = email && !validateEmail(email) ? 'E-mail inválido.' : '';
  const phoneError = whatsapp && !validatePhone(whatsapp) ? 'WhatsApp inválido.' : '';
  const pixKeyError = getPixKeyError();

  async function lookupCPF() {
    setCpfError('');
    setCpfLooking(true);
    try {
      const rawCpf = cpfInput.replace(/\D/g, '');
      const res = await fetch(`/api/participants?cpf=${rawCpf}`);
      const data = await res.json();
      setCpf(rawCpf);
      if (data.found && data.participant) {
        const p = data.participant;
        setNome(p.nome);
        setWhatsapp(formatPhone(p.whatsapp));
        setEmail(p.email);
        setPixType(p.pix_type as PixType);
        setPixKey(p.pix_type === 'telefone' ? formatPhone(p.pix_key) : p.pix_key);
        setParticipantExists(true);
        setLookupMessage({
          type: 'found',
          text: 'Dados encontrados na nossa base! Por favor, confira e confirme se suas informações estão atualizadas antes de prosseguir.',
        });
      } else {
        setParticipantExists(false);
        setLookupMessage({
          type: 'new',
          text: 'Nenhum dado encontrado para este CPF. Por favor, preencha suas informações para se cadastrar.',
        });
      }
      setStep('form');
    } catch {
      setCpfError('Erro ao verificar CPF. Tente novamente.');
    } finally {
      setCpfLooking(false);
    }
  }

  function handlePixKeyChange(val: string) {
    if (pixType === 'telefone') setPixKey(formatPhone(val));
    else if (pixType === 'cpf') setPixKey(formatCPF(val));
    else setPixKey(val.toLowerCase());
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const termsChecked = (document.getElementById('accepted_terms') as HTMLInputElement)?.checked;
      const adultChecked = (document.getElementById('is_adult') as HTMLInputElement)?.checked;
      const rawPixKey = pixType === 'telefone' || pixType === 'cpf'
        ? pixKey.replace(/\D/g, '')
        : pixKey;

      const response = await fetch('/api/palpites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pool_id: poolId,
          cpf,
          nome,
          whatsapp: rawPhone(whatsapp),
          email,
          pix_type: pixType,
          pix_key: rawPixKey,
          home_score: homeScore,
          away_score: awayScore,
          accepted_terms: termsChecked,
          is_adult: adultChecked,
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

  // ── Step 1: CPF ──────────────────────────────────────────────
  if (step === 'cpf') {
    return (
      <div className="space-y-4 rounded-xl border border-zinc-800 bg-sp-dark p-5">
        <div>
          <h2 className="text-xl font-black">Faça seu palpite</h2>
          <p className="mt-1 text-sm text-zinc-400">Comece informando seu CPF para identificação.</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">CPF</p>
          <Input
            value={cpfInput}
            onChange={(e) => {
              setCpfError('');
              setCpfInput(formatCPF(e.target.value));
            }}
            placeholder="000.000.000-00"
            maxLength={14}
            inputMode="numeric"
          />
          {cpfInput.length === 14 && !cpfInputValid && (
            <p className="mt-1 text-xs text-red-400">CPF inválido.</p>
          )}
          {cpfError && <p className="mt-1 text-xs text-red-400">{cpfError}</p>}
        </div>

        <Button
          className="w-full"
          disabled={!cpfInputValid || cpfLooking}
          onClick={lookupCPF}
        >
          {cpfLooking ? 'Verificando...' : 'Continuar'}
        </Button>
      </div>
    );
  }

  // ── Step 2: Full form ────────────────────────────────────────
  return (
    <>
      <form onSubmit={submit} className="space-y-5 rounded-xl border border-zinc-800 bg-sp-dark p-5">
        <div>
          <h2 className="text-xl font-black">Faça seu palpite</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Escolha o placar e confirme seus dados.</p>
        </div>

        {lookupMessage && (
          <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${
            lookupMessage.type === 'found'
              ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300'
              : 'border-blue-800 bg-blue-950/40 text-blue-300'
          }`}>
            <span className="mr-2">{lookupMessage.type === 'found' ? '✅' : 'ℹ️'}</span>
            {lookupMessage.text}
          </div>
        )}

        {/* Placar */}
        <div className="rounded-xl border border-zinc-800 bg-sp-black/60 p-5">
          <div className="flex items-center justify-between gap-2">
            <ScoreSelector label={homeTeam || 'Casa'} value={homeScore} onChange={setHomeScore} />
            <ScoreSelector label={awayTeam || 'Visitante'} value={awayScore} onChange={setAwayScore} />
          </div>
          <p className="mt-3 text-center text-xs text-zinc-600">
            Seu palpite: {homeScore} — {awayScore}
          </p>
        </div>

        {/* Dados pessoais */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-zinc-300">Seus dados</p>

          <div>
            <p className="mb-1 text-xs font-bold text-zinc-500">CPF</p>
            <Input value={formatCPF(cpf)} readOnly className="cursor-not-allowed opacity-60" />
          </div>

          <div>
            <p className="mb-1 text-xs font-bold text-zinc-500">Nome completo</p>
            <Input
              value={nome}
              onChange={(e) => setNome(formatName(e.target.value))}
              placeholder="João José Mota"
              required
            />
          </div>

          <div>
            <p className="mb-1 text-xs font-bold text-zinc-500">WhatsApp</p>
            <Input
              value={whatsapp}
              onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
              placeholder="(11) 98888-0000"
              inputMode="numeric"
              maxLength={15}
              required
            />
            {phoneError && <p className="mt-1 text-xs text-red-400">{phoneError}</p>}
          </div>

          <div>
            <p className="mb-1 text-xs font-bold text-zinc-500">E-mail</p>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="seuemail@email.com"
              type="email"
              required
            />
            {emailError && <p className="mt-1 text-xs text-red-400">{emailError}</p>}
          </div>
        </div>

        {/* Chave Pix */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-zinc-300">Chave Pix para receber o prêmio</p>

          {/* Tipo de chave */}
          <div className="grid grid-cols-3 gap-2">
            {(['email', 'cpf', 'telefone'] as PixType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setPixType(t); setPixKey(''); }}
                className={`rounded-lg border py-2 text-xs font-bold uppercase tracking-wider transition ${
                  pixType === t
                    ? 'border-sp-gold bg-sp-gold/10 text-sp-gold'
                    : 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t === 'email' ? 'E-mail' : t === 'cpf' ? 'CPF' : 'Telefone'}
              </button>
            ))}
          </div>

          <div>
            <Input
              value={pixKey}
              onChange={(e) => handlePixKeyChange(e.target.value)}
              placeholder={
                pixType === 'email' ? 'seuemail@email.com' :
                pixType === 'cpf' ? '000.000.000-00' :
                '(11) 98888-0000'
              }
              inputMode={pixType === 'email' ? 'email' : 'numeric'}
              maxLength={pixType === 'cpf' ? 14 : pixType === 'telefone' ? 15 : undefined}
              required
            />
            {pixKeyError && <p className="mt-1 text-xs text-red-400">{pixKeyError}</p>}
          </div>

          <p className="rounded-lg border border-zinc-800 bg-sp-black/40 p-3 text-xs leading-relaxed text-zinc-500">
            🔒 Seus dados são protegidos e tratados de acordo com a{' '}
            <strong className="text-zinc-400">LGPD (Lei 13.709/2018)</strong>. As informações
            coletadas são utilizadas exclusivamente para sua identificação e para envio do prêmio
            em caso de acerto. Não compartilhamos seus dados com terceiros.
          </p>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-300">
            <input id="is_adult" name="is_adult" type="checkbox" className="mt-0.5 h-4 w-4 rounded border-zinc-600 accent-sp-gold" required />
            <span>Confirmo que sou maior de 18 anos.</span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-300">
            <input id="accepted_terms" name="accepted_terms" type="checkbox" className="mt-0.5 h-4 w-4 rounded border-zinc-600 accent-sp-gold" required />
            <span>
              Li e aceito o{' '}
              <a href="/regulamento" target="_blank" className="text-sp-gold underline">regulamento</a>.
            </span>
          </label>
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-200">{error}</div>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={() => setStep('cpf')}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-400 hover:border-zinc-500">
            Voltar
          </button>
          <Button
            type="submit"
            className="flex-1 text-base"
            disabled={loading || !!emailError || !!phoneError || !!pixKeyError}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-sp-black/30 border-t-sp-black" />
                Gerando Pix...
              </span>
            ) : 'Confirmar Palpite e Pagar'}
          </Button>
        </div>
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
