import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const variants: Record<Variant, string> = {
  primary: 'bg-sp-gold text-sp-black hover:brightness-110 hover:shadow-lg hover:shadow-sp-gold/25',
  secondary: 'bg-sp-card text-sp-white hover:bg-zinc-700',
  danger: 'bg-sp-error text-white hover:brightness-110',
  ghost: 'bg-transparent text-sp-gold hover:bg-sp-card',
};

export function Button({ className, variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn('inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 font-bold transition disabled:cursor-not-allowed disabled:opacity-50', variants[variant], className)}
      {...props}
    />
  );
}

