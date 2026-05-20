import Link from 'next/link';

const steps = [
  {
    n: '01',
    title: 'Escolha o jogo',
    desc: 'Na página inicial, encontre o bolão do jogo que deseja participar. Verifique a data, horário e o prêmio acumulado. Clique em "Participar agora".',
    tip: 'Os palpites encerram 30 minutos antes do início da partida. Não deixe para a última hora!',
  },
  {
    n: '02',
    title: 'Informe seu CPF',
    desc: 'Ao abrir o bolão, informe seu CPF. Se você já participou antes, seus dados serão carregados automaticamente. Se for seu primeiro acesso, preencha o cadastro completo.',
    tip: 'Seus dados ficam salvos de forma segura. Na próxima participação, basta digitar o CPF.',
  },
  {
    n: '03',
    title: 'Confirme ou preencha seus dados',
    desc: 'Verifique se seu nome completo, WhatsApp, e-mail e chave Pix estão corretos. Você pode atualizar qualquer informação antes de confirmar o palpite.',
    tip: 'A chave Pix é fundamental — é nela que o prêmio será pago caso você vença. Confira com cuidado.',
  },
  {
    n: '04',
    title: 'Escolha o placar',
    desc: 'Selecione o placar exato que você acredita que vai acontecer. Use os botões "+" e "−" para ajustar os gols do time mandante e do visitante.',
    tip: 'Apenas o placar exato ao final de 90 minutos é premiado — sem prorrogação ou pênaltis.',
  },
  {
    n: '05',
    title: 'Aceite os termos e gere o Pix',
    desc: 'Confirme que tem mais de 18 anos e que leu o regulamento. Clique em "Confirmar Palpite e Pagar" para gerar o QR Code do Pix.',
    tip: 'O código Pix expira em 10 minutos. Tenha o aplicativo do seu banco pronto antes de gerar.',
  },
  {
    n: '06',
    title: 'Pague o Pix',
    desc: 'Escaneie o QR Code no aplicativo do seu banco, ou copie o código "Pix copia e cola" e cole no app. Realize o pagamento dentro do prazo.',
    tip: 'Verifique se o valor e o destinatário estão corretos antes de confirmar o pagamento.',
  },
  {
    n: '07',
    title: 'Receba o comprovante',
    desc: 'Após a confirmação do pagamento, a plataforma exibe seu comprovante com a chave de validação. Você também pode compartilhá-lo pelo WhatsApp.',
    tip: 'Guarde o link ou a chave de validação. Você pode acessar seu comprovante a qualquer momento.',
  },
  {
    n: '08',
    title: 'Aguarde o resultado',
    desc: 'Acompanhe o jogo! Após o apito final, o resultado é apurado automaticamente. Os palpites que acertaram o placar exato são premiados.',
    tip: 'Você pode acompanhar a lista de palpites confirmados em tempo real na página do bolão.',
  },
  {
    n: '09',
    title: 'Se você vencer — confirme sua chave Pix',
    desc: 'Caso você acerte o placar, o Super Palpite entrará em contato pelo WhatsApp e e-mail cadastrados para confirmar sua chave Pix antes de realizar o pagamento do prêmio.',
    tip: 'Responda à confirmação o quanto antes. Sem resposta em 30 dias, o prêmio não poderá mais ser reclamado.',
  },
  {
    n: '10',
    title: 'Receba o prêmio',
    desc: 'Após sua confirmação, o prêmio é transferido via Pix para a chave informada, em até 5 dias úteis. Se mais de uma pessoa acertar, o prêmio é dividido igualmente.',
    tip: 'Mantenha seus dados atualizados na plataforma para não perder a notificação de resultado.',
  },
];

export default function ComoPalpitarPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black">Como Palpitar</h1>
        <p className="mt-3 text-zinc-400">Siga o passo a passo abaixo e participe do bolão em menos de 2 minutos.</p>
      </div>

      <div className="relative space-y-0">
        {/* linha vertical */}
        <div className="absolute left-8 top-0 h-full w-px bg-zinc-800 md:left-10" />

        {steps.map((step, i) => (
          <div key={step.n} className="relative flex gap-6 pb-10 last:pb-0">
            {/* Número */}
            <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-sp-gold bg-sp-black text-lg font-black text-sp-gold md:h-20 md:w-20 md:text-xl">
              {step.n}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 pt-3">
              <h2 className="text-lg font-black text-sp-white">{step.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{step.desc}</p>
              <div className="mt-3 rounded-lg border border-sp-gold/20 bg-sp-gold/5 px-4 py-2.5">
                <p className="text-xs leading-relaxed text-zinc-400">
                  <span className="font-bold text-sp-gold">Dica: </span>{step.tip}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-2xl border border-sp-gold/30 bg-gradient-to-br from-sp-gold/10 to-transparent p-8 text-center">
        <h2 className="text-2xl font-black">Pronto para participar?</h2>
        <p className="mt-2 text-zinc-400">Escolha um jogo disponível e faça seu palpite agora.</p>
        <Link href="/#jogos"
          className="mt-6 inline-block rounded-xl bg-sp-gold px-8 py-3 font-black text-sp-black transition hover:brightness-110">
          Ver jogos disponíveis
        </Link>
        <p className="mt-4 text-xs text-zinc-600">
          Dúvidas? Confira nosso{' '}
          <Link href="/faq" className="text-sp-gold hover:underline">FAQ</Link>
          {' '}ou leia o{' '}
          <Link href="/regulamento" className="text-sp-gold hover:underline">Regulamento completo</Link>.
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Como Palpitar',
  description: 'Aprenda passo a passo como participar dos bolões de placar exato no Super Palpite: cadastro, pagamento via Pix, comprovante e recebimento do prêmio.',
  alternates: { canonical: 'https://superpalpite.com/como-palpitar' },
};
