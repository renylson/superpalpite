'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    category: 'Participação',
    items: [
      {
        q: 'O que é o Super Palpite?',
        a: 'O Super Palpite é uma plataforma de entretenimento esportivo onde você tenta acertar o placar exato de uma partida de futebol. Se acertar, concorre ao prêmio acumulado do bolão.',
      },
      {
        q: 'Quem pode participar?',
        a: 'Qualquer pessoa maior de 18 anos com CPF, WhatsApp, e-mail e chave Pix válidos. A participação é pessoal e intransferível.',
      },
      {
        q: 'Como funciona o cadastro?',
        a: 'Basta informar seu CPF na tela do bolão. Se for seu primeiro acesso, preencha seus dados. Nas próximas vezes, tudo é carregado automaticamente — você só confirma e escolhe o placar.',
      },
      {
        q: 'Posso participar de mais de um bolão ao mesmo tempo?',
        a: 'Sim! Você pode participar de quantos bolões quiser, e até comprar mais de um bilhete no mesmo bolão com palpites diferentes.',
      },
      {
        q: 'Até quando posso fazer meu palpite?',
        a: 'Os palpites encerram automaticamente 30 minutos antes do horário oficial de início da partida. Após esse prazo, nenhum novo palpite é aceito.',
      },
    ],
  },
  {
    category: 'Pagamento',
    items: [
      {
        q: 'Como funciona o pagamento?',
        a: 'Após confirmar seu palpite, é gerado um QR Code Pix válido por 10 minutos. Basta escanear no app do seu banco ou usar o código "copia e cola". O bilhete só é validado após a confirmação do pagamento.',
      },
      {
        q: 'O código Pix expirou — o que fazer?',
        a: 'Se o código expirar antes de você pagar, o palpite é descartado automaticamente. Basta reiniciar o processo e gerar um novo palpite.',
      },
      {
        q: 'Meu pagamento foi confirmado. Como sei que meu bilhete está válido?',
        a: 'Após a confirmação, a plataforma exibe uma tela de comprovante com sua chave de validação. Você também pode visualizar seu bilhete pelo link gerado e compartilhá-lo pelo WhatsApp.',
      },
      {
        q: 'Posso pagar com cartão de crédito?',
        a: 'Não. O único método de pagamento aceito é o Pix.',
      },
    ],
  },
  {
    category: 'Prêmio',
    items: [
      {
        q: 'Como é formado o prêmio?',
        a: 'Uma parte do valor de cada bilhete pago vai para o fundo de premiação. O percentual exato está indicado na página de cada bolão. O prêmio mínimo é garantido pelo organizador.',
      },
      {
        q: 'O que conta como placar exato?',
        a: 'O placar ao término dos 90 minutos de jogo, sem considerar prorrogação ou pênaltis. Por exemplo, se o jogo terminar 2 × 1 no tempo normal e for para a prorrogação, quem apostou 2 × 1 vence.',
      },
      {
        q: 'E se ninguém acertar o placar?',
        a: 'Nenhum prêmio é distribuído naquele bolão. Os valores arrecadados ficam retidos pelo Super Palpite, conforme o regulamento.',
      },
      {
        q: 'E se mais de uma pessoa acertar?',
        a: 'O prêmio é dividido igualmente entre todos os que acertaram o placar exato.',
      },
      {
        q: 'Como sei se ganhei?',
        a: 'Após a apuração do resultado, o Super Palpite entra em contato pelo WhatsApp e e-mail cadastrados para informar sobre o prêmio e confirmar sua chave Pix antes de realizar o pagamento.',
      },
      {
        q: 'Quanto tempo leva para receber o prêmio?',
        a: 'Após você confirmar sua chave Pix pela mensagem que enviaremos, o pagamento é realizado em até 5 dias úteis.',
      },
      {
        q: 'Por que precisam confirmar minha chave Pix antes de pagar?',
        a: 'Para evitar erros de transferência. Confirmamos sua chave antes de enviar o prêmio, garantindo que o dinheiro chegue na conta certa.',
      },
      {
        q: 'O que acontece se eu não responder à confirmação?',
        a: 'Se não houver resposta em 30 dias, o prêmio não poderá mais ser reclamado. Mantenha seu WhatsApp e e-mail atualizados para não perder essa notificação.',
      },
    ],
  },
  {
    category: 'Jogo e Resultado',
    items: [
      {
        q: 'O que acontece se o jogo for cancelado ou adiado?',
        a: 'O Super Palpite pode manter o bolão para a nova data, cancelá-lo ou encerrar a rodada. Consulte o regulamento para entender o tratamento dos valores em cada situação.',
      },
      {
        q: 'E se o jogo for interrompido durante a partida?',
        a: 'Será considerado o resultado oficial reconhecido pela entidade organizadora da competição ao momento da interrupção, conforme previsto no regulamento.',
      },
      {
        q: 'Posso contestar o resultado?',
        a: 'Sim. Você tem até 24 horas após a publicação do resultado para contestar pelo canal oficial de atendimento. Após esse prazo, o resultado é definitivo.',
      },
    ],
  },
  {
    category: 'Dados e Segurança',
    items: [
      {
        q: 'Meus dados são seguros?',
        a: 'Sim. Seus dados pessoais (CPF, WhatsApp, e-mail, chave Pix) são usados exclusivamente para identificação e pagamento do prêmio, tratados conforme a LGPD. Nunca são exibidos publicamente.',
      },
      {
        q: 'O que aparece publicamente no bolão?',
        a: 'Apenas seu nome abreviado e o placar escolhido são exibidos na lista pública de palpites.',
      },
      {
        q: 'Posso alterar meus dados cadastrais?',
        a: 'Sim. Na próxima participação, ao digitar seu CPF, seus dados serão carregados e você poderá atualizá-los antes de confirmar o palpite.',
      },
    ],
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-800 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-bold text-zinc-200">{q}</span>
        <span className={`shrink-0 text-sp-gold transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-zinc-400">{a}</p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black">Perguntas Frequentes</h1>
        <p className="mt-3 text-zinc-400">Encontre respostas para as dúvidas mais comuns sobre o Super Palpite.</p>
      </div>

      <div className="space-y-8">
        {faqs.map(section => (
          <div key={section.category}>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-sp-gold">{section.category}</h2>
            <div className="rounded-xl border border-zinc-800 bg-sp-dark px-5">
              {section.items.map(item => (
                <Item key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-zinc-800 bg-sp-dark p-6 text-center">
        <p className="text-zinc-400">Não encontrou sua resposta?</p>
        <p className="mt-2 text-sm text-zinc-500">
          Consulte o{' '}
          <Link href="/regulamento" className="text-sp-gold hover:underline">Regulamento completo</Link>
          {' '}ou leia o guia{' '}
          <Link href="/como-palpitar" className="text-sp-gold hover:underline">Como Palpitar</Link>.
        </p>
      </div>
    </div>
  );
}
