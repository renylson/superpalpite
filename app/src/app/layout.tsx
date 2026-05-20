import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import './globals.css';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const BASE_URL = 'https://superpalpite.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | Super Palpite',
    default: 'Super Palpite — Acerte o Placar e Ganhe Prêmios via Pix',
  },
  description: 'Chute o placar exato do jogo, pague via Pix e concorra ao prêmio. Bolões de futebol rápidos, seguros e 100% online. Prêmio garantido para quem acertar!',
  keywords: ['bolão futebol', 'palpite placar exato', 'bolão pix', 'prêmio futebol', 'acertar placar', 'bolão online'],
  authors: [{ name: 'Super Palpite' }],
  creator: 'Super Palpite',
  publisher: 'Super Palpite',
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Super Palpite',
    title: 'Super Palpite — Acerte o Placar e Ganhe Prêmios via Pix',
    description: 'Chute o placar exato, pague via Pix e concorra ao prêmio. Bolões de futebol rápidos, seguros e 100% online.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Super Palpite — Bolões de Placar Exato' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Super Palpite — Acerte o Placar e Ganhe Prêmios via Pix',
    description: 'Chute o placar exato, pague via Pix e concorra ao prêmio. Rápido, seguro e 100% online.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Super Palpite',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  contactPoint: [
    { '@type': 'ContactPoint', email: 'suporte@superpalpite.com', contactType: 'customer support', availableLanguage: 'Portuguese' },
    { '@type': 'ContactPoint', email: 'contato@superpalpite.com', contactType: 'sales', availableLanguage: 'Portuguese' },
  ],
  sameAs: [],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="beforeInteractive" />
            <Script id="ga-init" strategy="beforeInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
      </head>
      <body className="flex min-h-screen flex-col bg-sp-black text-sp-white">

        {/* Skip navigation — acessibilidade */}
        <a href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-sp-gold focus:px-4 focus:py-2 focus:text-sm focus:font-black focus:text-sp-black">
          Ir para o conteúdo
        </a>

        <header className="sticky top-0 z-10 border-b border-zinc-800 bg-sp-black/95 backdrop-blur-sm">
          <nav aria-label="Navegação principal" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" aria-label="Super Palpite — página inicial" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Super Palpite" width={160} height={64} style={{ height: '4rem', width: 'auto' }} className="object-contain" />
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/como-palpitar" className="rounded-md px-3 py-2 text-sm font-bold text-zinc-400 transition hover:bg-zinc-800 hover:text-sp-white">
                Como Palpitar
              </Link>
              <Link href="/faq" className="rounded-md px-3 py-2 text-sm font-bold text-zinc-400 transition hover:bg-zinc-800 hover:text-sp-white">
                FAQ
              </Link>
              <Link href="/regulamento" className="rounded-md px-3 py-2 text-sm font-bold text-zinc-400 transition hover:bg-zinc-800 hover:text-sp-white">
                Regulamento
              </Link>
            </div>
          </nav>
        </header>

        <main id="main-content" className="flex-1">{children}</main>

        <footer className="border-t border-zinc-800 bg-sp-dark">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Marca */}
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Super Palpite" width={120} height={48} style={{ height: '3rem', width: 'auto' }} className="object-contain" />
                <p className="mt-2 text-xs text-zinc-500">Palpites inteligentes. Resultados reais.</p>
              </div>

              {/* Links */}
              <nav aria-label="Links do rodapé">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-600">Navegação</p>
                <div className="flex flex-col gap-1.5 text-xs text-zinc-500">
                  <Link href="/como-palpitar" className="hover:text-zinc-300">Como Palpitar</Link>
                  <Link href="/faq" className="hover:text-zinc-300">Perguntas Frequentes</Link>
                  <Link href="/regulamento" className="hover:text-zinc-300">Regulamento</Link>
                </div>
              </nav>

              {/* Contato */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-600">Contato</p>
                <div className="flex flex-col gap-1.5 text-xs text-zinc-500">
                  <a href="mailto:suporte@superpalpite.com" className="hover:text-zinc-300">
                    suporte@superpalpite.com
                  </a>
                  <a href="mailto:contato@superpalpite.com" className="hover:text-zinc-300">
                    contato@superpalpite.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-zinc-800 pt-4 text-center text-xs text-zinc-700">
              © {new Date().getFullYear()} Super Palpite. Todos os direitos reservados. Proibida a participação de menores de 18 anos.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
