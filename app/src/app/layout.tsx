import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Super Palpite — Bolões de Placar Exato',
  description: 'Acerte o placar exato, pague via Pix e concorra ao prêmio. Bolões profissionais com apuração automática.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col bg-sp-black text-sp-white">
        <header className="sticky top-0 z-10 border-b border-zinc-800 bg-sp-black/95 backdrop-blur-sm">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Super Palpite" style={{ height: '4rem' }} className="w-auto object-contain" />
            </Link>
            <div className="flex items-center gap-1">
              <Link
                href="/regulamento"
                className="rounded-md px-3 py-2 text-sm font-bold text-zinc-400 transition hover:bg-zinc-800 hover:text-sp-white"
              >
                Regulamento
              </Link>
              <Link
                href="/admin/login"
                className="rounded-md border border-zinc-700 px-3 py-2 text-sm font-bold text-zinc-400 transition hover:border-zinc-500 hover:text-sp-white"
              >
                Admin
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-zinc-800 bg-sp-dark">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Super Palpite" style={{ height: '3rem' }} className="w-auto object-contain" />
                <p className="mt-1 text-xs text-zinc-500">Palpites inteligentes. Resultados reais.</p>
              </div>
              <div className="flex gap-4 text-xs text-zinc-500">
                <Link href="/regulamento" className="hover:text-zinc-300">Regulamento</Link>
                <span>©{new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
