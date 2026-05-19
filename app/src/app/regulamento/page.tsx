import { Card } from '@/components/ui/Card';

const sections = [
  ['Como funciona', 'Escolha o placar exato de um jogo, informe seus dados, gere o Pix e pague dentro do prazo. Só palpites com pagamento confirmado concorrem.'],
  ['Divisão do bilhete', 'Por padrão, 40% é taxa administrativa e 60% compõe a premiação. O valor fica congelado no momento do palpite pago.'],
  ['Prêmio mínimo', 'Bilhetes até R$ 19,90 têm prêmio mínimo de 20x o bilhete. Acima disso, o mínimo é 10x o bilhete.'],
  ['Premiação', 'Vence quem acertar o placar exato. Se houver mais de um vencedor, o prêmio atual é dividido igualmente. Se ninguém acertar, não há pagamento de prêmio.'],
  ['Privacidade e LGPD', 'Nome completo, WhatsApp e chave Pix são usados para identificação, cobrança e pagamento de prêmio. Publicamente aparece apenas o nome abreviado e o placar.'],
];

export default function RegulamentoPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-4xl font-black">Regulamento</h1>
      <div className="mt-6 space-y-4">
        {sections.map(([title, text]) => (
          <Card key={title}>
            <h2 className="text-xl font-black text-sp-gold">{title}</h2>
            <p className="mt-2 text-zinc-300">{text}</p>
          </Card>
        ))}
        <Card className="border-sp-warning/50">
          <h2 className="text-xl font-black text-sp-warning">Aviso jurídico</h2>
          <p className="mt-2 text-zinc-300">Este produto envolve pagamento, prêmio e resultado esportivo. É necessária validação jurídica antes da operação pública.</p>
        </Card>
      </div>
    </section>
  );
}

