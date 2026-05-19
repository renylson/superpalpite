'use client';

import { useEffect, useState } from 'react';

function diffLabel(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return 'Encerrado';
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}

export function CountdownTimer({ matchDate }: { matchDate: string }) {
  const [label, setLabel] = useState(diffLabel(matchDate));
  useEffect(() => {
    const timer = window.setInterval(() => setLabel(diffLabel(matchDate)), 1000);
    return () => window.clearInterval(timer);
  }, [matchDate]);
  return <span className="font-bold text-sp-gold">{label}</span>;
}

