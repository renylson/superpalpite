import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('min-h-11 w-full rounded-md border border-zinc-700 bg-sp-black px-3 py-2 text-white outline-none focus:border-sp-gold', className)} {...props} />;
}

