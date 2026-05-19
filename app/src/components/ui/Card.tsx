import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-lg border border-zinc-800 bg-sp-dark p-4 shadow-sm', className)} {...props} />;
}

