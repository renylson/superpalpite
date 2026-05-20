'use client';

import { useEffect, useState } from 'react';

const CLOSE_BEFORE_MS = 30 * 60 * 1000; // fecha 30 min antes da partida

function getTimeLeft(matchDate: string) {
  const closeTime = new Date(matchDate).getTime() - CLOSE_BEFORE_MS;
  const diff = closeTime - Date.now();
  if (diff <= 0) return null;
  return {
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-sp-gold/40 bg-sp-black text-2xl font-black tabular-nums text-sp-gold shadow-inner">
        {String(value).padStart(2, '0')}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
    </div>
  );
}

export function CountdownTimer({ matchDate }: { matchDate: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(matchDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(matchDate)), 1000);
    return () => clearInterval(timer);
  }, [matchDate]);

  if (!timeLeft) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-center">
        <p className="font-bold text-red-400">Palpites encerrados</p>
        <p className="mt-0.5 text-xs text-zinc-500">Os palpites fecham 30 minutos antes da partida</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-zinc-500">
        Palpites fecham em
      </p>
      <div className="flex items-start justify-center gap-2">
        <Segment value={timeLeft.hours} label="horas" />
        <span className="mt-3 text-2xl font-black text-zinc-600">:</span>
        <Segment value={timeLeft.minutes} label="min" />
        <span className="mt-3 text-2xl font-black text-zinc-600">:</span>
        <Segment value={timeLeft.seconds} label="seg" />
      </div>
    </div>
  );
}
