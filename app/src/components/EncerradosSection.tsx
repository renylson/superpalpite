'use client';

import { useState } from 'react';
import { BolaoCardEncerrado } from '@/components/BolaoCardEncerrado';
import type { Pool } from '@/types';

const INITIAL_LIMIT = 6;

export function EncerradosSection({ pools }: { pools: Pool[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? pools : pools.slice(0, INITIAL_LIMIT);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((pool) => (
          <BolaoCardEncerrado key={pool.id} pool={pool} />
        ))}
      </div>

      {!showAll && pools.length > INITIAL_LIMIT && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(true)}
            className="rounded-lg border border-zinc-700 px-6 py-2.5 text-sm font-bold text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
          >
            Ver mais ({pools.length - INITIAL_LIMIT} jogos)
          </button>
        </div>
      )}
    </div>
  );
}
