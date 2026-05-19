import type { Guess } from '@/types';

export function PalpitesTable({ guesses }: { guesses: Guess[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-sp-card text-zinc-300">
          <tr><th className="p-3">Nome</th><th>Placar</th><th>Pagamento</th><th>Status</th><th>Criado</th></tr>
        </thead>
        <tbody>
          {guesses.map((guess) => (
            <tr key={guess.id} className="border-t border-zinc-800">
              <td className="p-3">{guess.public_name}</td>
              <td>{guess.home_score}x{guess.away_score}</td>
              <td>{guess.payment_status}</td>
              <td>{guess.status}</td>
              <td>{new Date(guess.created_at).toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

