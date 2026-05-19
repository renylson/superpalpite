import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('inline-flex rounded-full border border-sp-gold/30 bg-sp-gold/10 px-3 py-1 text-xs font-bold uppercase text-sp-gold', className)} {...props} />;
}

