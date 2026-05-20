import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function PagamentosPage() {
  const supabase = createServiceSupabaseClient();

  const { data: payments } = await supabase
    .from('payments')
    .select(`
      id, status, amount, created_at, mercado_pago_id,
      guesses (
        id, nome, email, home_score, away_score, comprovante_key,
        games ( home_team, away_team, competition )
      )
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(200);

  const rows = (payments ?? []) as unknown as Array<{
    id: string;
    amount: number;
    created_at: string;
    mercado_pago_id: string | null;
    guesses: {
      id: string;
      nome: string;
      email: string | null;
      home_score: number;
      away_score: number;
      comprovante_key: string | null;
      games: { home_team: string; away_team: string; competition: string | null } | null;
    } | null;
  }>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Pagamentos recebidos</h1>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-bold text-zinc-400">
          {rows.length} aprovado{rows.length !== 1 ? 's' : ''}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 py-12 text-center text-zinc-500">
          Nenhum pagamento aprovado ainda.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-sp-black/60 text-xs font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Participante</th>
                <th className="px-4 py-3">Jogo</th>
                <th className="px-4 py-3">Palpite</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">MP ID</th>
                <th className="px-4 py-3">Comprovante</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const g = p.guesses;
                return (
                  <tr key={p.id} className="border-t border-zinc-800 hover:bg-sp-black/30">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                      {new Date(p.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold">{g?.nome ?? '—'}</p>
                      <p className="text-xs text-zinc-500">{g?.email ?? 'sem e-mail'}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {g?.games ? (
                        <>
                          <p className="font-bold text-zinc-300">{g.games.home_team} × {g.games.away_team}</p>
                          <p>{g.games.competition}</p>
                        </>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {g ? (
                        <span className="rounded bg-zinc-800 px-2 py-0.5 font-black text-sp-gold">
                          {g.home_score} × {g.away_score}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 font-black text-emerald-400">
                      {formatCurrency(Number(p.amount))}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-600">
                      {p.mercado_pago_id ? p.mercado_pago_id.slice(0, 14) + '…' : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {g?.comprovante_key ? (
                        <a
                          href={`/comprovante/${g.comprovante_key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-black text-sp-gold hover:underline"
                        >
                          {g.comprovante_key}
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-600">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
