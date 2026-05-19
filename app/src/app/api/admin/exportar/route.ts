import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { assertAdmin, createServiceSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    await assertAdmin(request.headers.get('authorization'));
    const poolId = request.nextUrl.searchParams.get('pool_id');
    if (!poolId) return NextResponse.json({ error: 'pool_id obrigatório.' }, { status: 400 });
    const { data, error } = await createServiceSupabaseClient().from('guesses').select('*').eq('pool_id', poolId).order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Palpites');
    sheet.columns = [
      { header: 'Nome público', key: 'public_name' },
      { header: 'Placar', key: 'score' },
      { header: 'Pagamento', key: 'payment_status' },
      { header: 'Status', key: 'status' },
      { header: 'Valor', key: 'ticket_amount_snapshot' },
      { header: 'Criado em', key: 'created_at' },
    ];
    for (const guess of data ?? []) {
      sheet.addRow({ ...guess, score: `${guess.home_score}x${guess.away_score}` });
    }
    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="superpalpite-${poolId}.xlsx"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Não autorizado.' }, { status: 401 });
  }
}
