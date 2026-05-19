import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Super Palpite',
  description: 'Bolões de placar exato com Pix e apuração automática.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-sp-black text-sp-white">
        <header className="border-b border-zinc-800 bg-sp-black/95">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-black text-sp-gold">SUPER PALPITE</Link>
            <div className="flex gap-4 text-sm font-bold text-zinc-300">
              <Link href="/regulamento">Regulamento</Link>
              <Link href="/admin/login">Admin</Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

