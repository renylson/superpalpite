import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

export function abbreviateName(name: string): string {
  const parts = name.trim().replace(/\s+/g, ' ').split(' ');
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1].charAt(0).toUpperCase()}.`;
}

export function sanitizePhone(value: string): string {
  return value.replace(/\D/g, '');
}

export function toMoney(value: number): number {
  return Number(Number(value).toFixed(2));
}

