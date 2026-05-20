'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export type Banner = {
  id: number;
  image: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  href?: string;
};

// Adicione seus banners aqui — coloque as imagens em /public/banners/
// Dimensões recomendadas: 1440 × 480 px (proporção 3:1)
const BANNERS: Banner[] = [
  {
    id: 1,
    image: '/banners/banner1.jpg',
    title: 'Acerte o Placar.',
    subtitle: 'Ganhe o Prêmio.',
    cta: 'Ver jogos disponíveis',
    href: '#jogos',
  },
  {
    id: 2,
    image: '/banners/banner2.jpg',
    title: 'Acerte o Placar.',
    subtitle: 'Ganhe o Prêmio.',
    cta: 'Ver jogos disponíveis',
    href: '#jogos',
  },
];

export function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prev = () => setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  useEffect(() => {
    if (paused || BANNERS.length <= 1) return;
    const timer = setInterval(next, 15000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const banner = BANNERS[current];

  return (
    <div
      className="relative overflow-hidden bg-zinc-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[3/1] w-full min-h-[200px]">
        {/* Camadas de imagem com crossfade */}
        {BANNERS.map((b, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={b.id}
            src={b.image}
            alt={b.title ?? 'Banner Super Palpite'}
            width={1440}
            height={480}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
            fetchPriority={i === 0 ? 'high' : 'low'}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding={i === 0 ? 'sync' : 'async'}
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        ))}

        {/* Gradiente suave — começa no centro e vai até a direita */}
        <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.25)_45%,transparent_65%)]" />

        {/* Conteúdo — fade junto com o banner */}
        {(banner.title || banner.cta) && (
          <div className="absolute inset-0 flex items-center justify-end px-8 md:px-16">
            <div className="max-w-lg text-right">
              {banner.title && (
                <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
                  {banner.title}
                </h2>
              )}
              {banner.subtitle && (
                <p className="mt-2 text-xl font-black text-sp-gold md:text-3xl">{banner.subtitle}</p>
              )}
              {banner.cta && (
                <Link
                  href={banner.href ?? '#'}
                  className="mt-6 inline-block rounded-lg bg-sp-gold px-6 py-3 font-black text-sp-black transition hover:brightness-110"
                >
                  {banner.cta}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navegação */}
      {BANNERS.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-sp-gold' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
