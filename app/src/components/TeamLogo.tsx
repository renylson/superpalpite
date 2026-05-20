'use client';

import { useState } from 'react';

function proxyUrl(url: string) {
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

export function TeamLogo({
  logo,
  name,
  size = 48,
}: {
  logo?: string | null;
  name: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (!logo || failed) {
    return (
      <span
        style={{ width: size, height: size, fontSize: size * 0.55 }}
        className="flex shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800"
      >
        ⚽
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={proxyUrl(logo)}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded object-contain"
      onError={() => setFailed(true)}
    />
  );
}
