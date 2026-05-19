'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-lg border border-zinc-800 bg-sp-dark p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black">{title}</h2>
          <Button type="button" variant="ghost" onClick={onClose}>Fechar</Button>
        </div>
        {children}
      </div>
    </div>
  );
}

