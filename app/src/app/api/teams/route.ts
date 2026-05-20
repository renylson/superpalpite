import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return NextResponse.json({ teams: [] });

  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(q)}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return NextResponse.json({ teams: [] });
    const json = await res.json() as { teams: unknown[] | null };
    return NextResponse.json({ teams: json.teams ?? [] });
  } catch {
    return NextResponse.json({ teams: [] });
  }
}
