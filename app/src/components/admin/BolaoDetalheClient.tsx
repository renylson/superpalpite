'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExportButton } from '@/components/admin/ExportButton';
import { ManualPalpiteModal } from '@/components/admin/ManualPalpiteModal';
import { PalpitesTable } from '@/components/admin/PalpitesTable';
import { ResultadoModal } from '@/components/admin/ResultadoModal';
import { Card } from '@/components/ui/Card';
import type { Guess } from '@/types';

export function BolaoDetalheClient({
  poolId,
  canPublishResult,
  guesses,
}: {
  poolId: string;
  canPublishResult: boolean;
  guesses: Guess[];
}) {
  const router = useRouter();
  const [showResultado, setShowResultado] = useState(false);
  const [showManual, setShowManual] = useState(false);

  return (
    <>
      {canPublishResult && (
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-black">Encerrar e publicar resultado</h3>
              <p className="mt-0.5 text-sm text-zinc-500">
                Informe o placar final para apurar os vencedores e dividir o prêmio.
              </p>
            </div>
            <button
              onClick={() => setShowResultado(true)}
              className="shrink-0 rounded-lg bg-sp-gold px-5 py-2.5 text-sm font-black text-sp-black hover:bg-sp-gold-dark"
            >
              Inserir placar
            </button>
          </div>
        </Card>
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-base font-black">
            Palpites{' '}
            <span className="ml-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
              {guesses.length}
            </span>
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowManual(true)}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-300 transition hover:border-zinc-500"
            >
              + Adicionar manualmente
            </button>
            <ExportButton poolId={poolId} />
          </div>
        </div>
        <PalpitesTable guesses={guesses} />
      </Card>

      {showResultado && (
        <ResultadoModal poolId={poolId} onClose={() => setShowResultado(false)} />
      )}

      {showManual && (
        <ManualPalpiteModal
          poolId={poolId}
          onClose={() => setShowManual(false)}
          onSuccess={() => {
            setShowManual(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
