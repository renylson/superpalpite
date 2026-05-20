import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_DOMAINS = [
  'football-logos.cc',
  'assets.football-logos.cc',
  'images.football-logos.cc',
  'flagcdn.com',
  'api.sofascore.com',
  'upload.wikimedia.org',
  'crests.football-data.org',
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('Missing url', { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }

  const allowed = ALLOWED_DOMAINS.some(
    (d) => parsed.hostname === d || parsed.hostname.endsWith(`.${d}`)
  );
  if (!allowed) return new NextResponse('Domain not allowed', { status: 403 });

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SuperPalpite/1.0)',
        Accept: 'image/*,*/*',
      },
      next: { revalidate: 86400 }, // cache 24h
    });

    if (!res.ok) return new NextResponse('Image not found', { status: 404 });

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') ?? 'image/png';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return new NextResponse('Failed to fetch image', { status: 502 });
  }
}
