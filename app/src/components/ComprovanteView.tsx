'use client';

import { formatCurrency } from '@/lib/utils';

interface Props {
  comprovanteKey: string;
  nome: string;
  homeTeam: string;
  awayTeam: string;
  competition: string | null;
  matchDate: string;
  homeScore: number;
  awayScore: number;
  ticketAmount: number;
  paidAt: string;
  isManual?: boolean;
}

export function ComprovanteView({
  comprovanteKey, nome, homeTeam, awayTeam, competition,
  matchDate, homeScore, awayScore, ticketAmount, paidAt, isManual = false,
}: Props) {
  const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://superpalpite.com'}/comprovante/${comprovanteKey}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;
  const paidDate = paidAt ? new Date(paidAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '';

  const waText = encodeURIComponent(
    `✅ *Comprovante Super Palpite*\n\n📋 *Chave:* ${comprovanteKey}\n⚽ *Jogo:* ${homeTeam} x ${awayTeam}\n🎯 *Palpite:* ${homeScore} × ${awayScore}\n\n🔗 ${url}`
  );

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      {/* Card principal */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-sp-dark shadow-2xl">

        {/* Header */}
        <div className="bg-sp-black px-6 py-5 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Super Palpite" className="mx-auto h-10 w-auto object-contain" />
        </div>

        {/* Banner confirmado */}
        <div className="bg-emerald-600 px-6 py-3 text-center">
          <p className="font-black text-white">✅ Palpite Confirmado e Pago</p>
        </div>

        {/* Chave validadora */}
        <div className="border-b border-zinc-800 bg-sp-gold/5 px-6 py-5 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Chave de Validação</p>
          <p className="mt-1 text-3xl font-black tracking-[0.2em] text-sp-gold">{comprovanteKey}</p>
          <p className="mt-1 text-xs text-zinc-600">Guarde esta chave como comprovante do seu palpite</p>
        </div>

        {/* Dados */}
        <div className="space-y-4 px-6 py-5">
          {/* Participante */}
          <div className="flex justify-between gap-2 border-b border-zinc-800 pb-3">
            <span className="text-sm text-zinc-500">Participante</span>
            <span className="text-right text-sm font-bold text-zinc-200">{nome}</span>
          </div>

          {/* Jogo */}
          <div className="flex justify-between gap-2 border-b border-zinc-800 pb-3">
            <span className="text-sm text-zinc-500">Jogo</span>
            <div className="text-right">
              <p className="text-sm font-bold text-zinc-200">{homeTeam} x {awayTeam}</p>
              {competition && <p className="text-xs text-zinc-500">{competition}</p>}
              <p className="text-xs text-zinc-500">{matchDate}</p>
            </div>
          </div>

          {/* Palpite */}
          <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <span className="text-sm text-zinc-500">Palpite</span>
            <span className="text-2xl font-black text-sp-gold">{homeScore} × {awayScore}</span>
          </div>

          {/* Forma de pagamento */}
          <div className="flex justify-between gap-2 border-b border-zinc-800 pb-3">
            <span className="text-sm text-zinc-500">Forma de pagamento</span>
            <span className="text-sm font-bold text-zinc-300">
              {isManual ? 'Pagamento manual (espécie)' : 'Pix'}
            </span>
          </div>

          {/* Valor */}
          <div className="flex justify-between gap-2 border-b border-zinc-800 pb-3">
            <span className="text-sm text-zinc-500">Valor pago</span>
            <span className="text-sm font-black text-emerald-400">{formatCurrency(ticketAmount)}</span>
          </div>

          {/* Data */}
          {paidDate && (
            <div className="flex justify-between gap-2">
              <span className="text-sm text-zinc-500">Data do pagamento</span>
              <span className="text-sm text-zinc-400">{paidDate}</span>
            </div>
          )}
        </div>

        {/* QR Code */}
        <div className="border-t border-zinc-800 px-6 py-5 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">QR Code do comprovante</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt="QR Code"
            className="mx-auto rounded-xl border-4 border-white bg-white p-1"
            width={180}
            height={180}
          />
          <p className="mt-2 text-xs text-zinc-600">Escaneie para verificar este comprovante</p>
        </div>

        {/* Botões */}
        <div className="space-y-3 border-t border-zinc-800 px-6 pb-6 pt-4">
          <a
            href={`https://wa.me/?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] font-black text-white transition hover:brightness-110"
          >
            Compartilhar no WhatsApp
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(url).then(() => alert('Link copiado!'))}
            className="flex min-h-11 w-full items-center justify-center rounded-xl border border-zinc-700 font-bold text-zinc-300 transition hover:border-zinc-500"
          >
            Copiar link do comprovante
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 bg-sp-black/60 px-6 py-3 text-center">
          <p className="text-xs text-zinc-600">Comprovante verificável em superpalpite.com.br</p>
          <p className="text-xs text-zinc-700">Dados protegidos conforme a LGPD</p>
        </div>
      </div>
    </div>
  );
}
