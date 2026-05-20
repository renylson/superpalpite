export default function RegulamentoPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black">Regulamento Geral</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
        <p className="mt-3 text-sm text-zinc-400">
          Ao realizar um palpite e efetuar o pagamento, o participante declara ter lido, compreendido e aceito integralmente as disposições deste Regulamento.
        </p>
      </div>

      <div className="space-y-7 text-sm leading-relaxed text-zinc-300">

        <Clausula n="1" titulo="Definições e Natureza da Atividade">
          O Super Palpite é uma plataforma de entretenimento esportivo que oferece bolões de placar exato mediante pagamento de bilhete de participação. A atividade consiste na previsão do resultado de partidas de futebol, cujo prêmio é formado por parcela das arrecadações dos participantes.
          {"\n\n"}
          O Super Palpite atua exclusivamente como plataforma de organização e gestão dos bolões, reservando-se o direito de administrar, alterar ou encerrar qualquer bolão a qualquer momento, a seu exclusivo critério, desde que devidamente informado aos participantes, sem que isso gere direito a indenização ou ressarcimento, salvo as hipóteses previstas neste Regulamento.
        </Clausula>

        <Clausula n="2" titulo="Participação">
          Somente poderão participar pessoas físicas maiores de 18 (dezoito) anos, mediante cadastro com dados verdadeiros. O participante é inteiramente responsável pela veracidade das informações prestadas, incluindo nome completo, CPF, WhatsApp, e-mail e chave Pix.
          {"\n\n"}
          Cada bilhete representa um único palpite. O mesmo participante poderá adquirir múltiplos bilhetes para o mesmo bolão, com palpites iguais ou distintos, conforme disponibilidade.
          {"\n\n"}
          O Super Palpite reserva-se o direito de cancelar, sem aviso prévio, palpites de participantes que apresentem indícios de irregularidade, dados falsos ou comportamento contrário a este Regulamento.
        </Clausula>

        <Clausula n="3" titulo="Pagamento e Validade do Bilhete">
          O bilhete somente será validado após a confirmação do pagamento via Pix dentro do prazo estabelecido na plataforma. Palpites não pagos ou com pagamento expirado serão automaticamente cancelados e excluídos do sistema.
          {"\n\n"}
          O prazo para pagamento do Pix é de 10 (dez) minutos a partir da geração do código. Após esse prazo, o código expira e o palpite é descartado.
          {"\n\n"}
          Os palpites encerram automaticamente 30 (trinta) minutos antes do horário oficial de início da partida. Não serão aceitos palpites após esse prazo.
        </Clausula>

        <Clausula n="4" titulo="Composição do Prêmio">
          Do valor total arrecadado com os bilhetes pagos, uma parcela destina-se à taxa de administração e gestão da plataforma, e a parcela restante compõe o fundo de premiação do bolão.
          {"\n\n"}
          O percentual de cada parcela é definido pelo Super Palpite no momento da criação de cada bolão, podendo variar entre diferentes bolões, conforme indicado na página de cada evento. O participante, ao adquirir o bilhete, concorda com a composição vigente.
          {"\n\n"}
          O prêmio mínimo garantido pode ser estabelecido pelo organizador de acordo com as condições de cada bolão, sendo que o prêmio efetivo será sempre o maior valor entre o mínimo garantido e o fundo acumulado.
        </Clausula>

        <Clausula n="5" titulo="Apuração do Resultado e Premiação">
          Será premiado o participante que acertar o placar exato da partida, conforme o resultado oficial ao término do tempo regulamentar de 90 (noventa) minutos, excluídas prorrogação e disputa por pênaltis, salvo indicação expressa em contrário na descrição do bolão.
          {"\n\n"}
          Na hipótese de mais de um participante acertar o placar exato, o prêmio será dividido em partes iguais entre todos os acertadores.
          {"\n\n"}
          Caso nenhum participante acerte o placar exato, não haverá distribuição de prêmio naquele bolão. Os valores do fundo de premiação ficam retidos pelo Super Palpite.
        </Clausula>

        <Clausula n="6" titulo="Alterações, Cancelamentos e Casos Especiais">
          O Super Palpite não se responsabiliza por eventos extraordinários relativos às partidas, incluindo, mas não se limitando a: adiamentos, cancelamentos, suspensões, nulidades, alterações de local, paralisações por decisão judicial ou administrativa, invasões de campo, condições climáticas ou quaisquer fatores alheios ao controle da plataforma.
          {"\n\n"}
          Caso a partida seja adiada antes do início, o bolão poderá permanecer válido para a nova data oficial, desde que a partida seja realizada em prazo razoável definido pelo Super Palpite.
          {"\n\n"}
          Caso a partida seja definitivamente cancelada ou não realizada, o Super Palpite poderá cancelar o bolão. Os valores pagos pelos participantes não serão restituídos após a validação dos bilhetes, salvo cobrança duplicada comprovada, erro operacional reconhecido pela plataforma ou cancelamento do bolão por decisão do Super Palpite antes do início da partida.
          {"\n\n"}
          Partidas iniciadas e encerradas antecipadamente seguirão o resultado oficial reconhecido pela entidade organizadora, salvo regra específica publicada no bolão.
        </Clausula>

        <Clausula n="7" titulo="Processo de Pagamento do Prêmio">
          Após a apuração do resultado e identificação do(s) vencedor(es), o Super Palpite entrará em contato com o participante premiado por meio do WhatsApp e e-mail cadastrados, para confirmação da chave Pix antes da realização do pagamento.
          {"\n\n"}
          O pagamento do prêmio somente será efetuado após a confirmação expressa do vencedor de que a chave Pix informada no cadastro está correta e ativa. Essa etapa visa evitar erros e proteger o participante.
          {"\n\n"}
          Caso o vencedor não responda à comunicação enviada pelo Super Palpite no prazo de 30 (trinta) dias corridos, o prêmio não será mais passível de reclamação, ficando os valores retidos pelo Super Palpite.
          {"\n\n"}
          O prazo de pagamento, após confirmação da chave Pix pelo vencedor, é de até 5 (cinco) dias úteis. O Super Palpite não se responsabiliza por atrasos decorrentes de instabilidades bancárias, manutenções do sistema financeiro ou fatores externos.
          {"\n\n"}
          O participante é responsável por manter seus dados de contato (WhatsApp e e-mail) atualizados na plataforma para garantir o recebimento das notificações de resultado e prêmio.
        </Clausula>

        <Clausula n="8" titulo="Proteção de Dados — LGPD">
          Os dados pessoais coletados (nome, CPF, WhatsApp, e-mail e chave Pix) são utilizados exclusivamente para fins de identificação do participante, processamento do pagamento e, em caso de vitória, confirmação e transferência do prêmio. Não são compartilhados com terceiros.
          {"\n\n"}
          Publicamente, são exibidos apenas o nome abreviado do participante e o placar escolhido. O CPF, WhatsApp, e-mail e chave Pix nunca são exibidos publicamente.
          {"\n\n"}
          O tratamento de dados observa as disposições da Lei Geral de Proteção de Dados Pessoais — LGPD (Lei nº 13.709/2018).
        </Clausula>

        <Clausula n="9" titulo="Responsabilidades e Limitações">
          O Super Palpite não garante disponibilidade ininterrupta da plataforma e não se responsabiliza por danos decorrentes de falhas técnicas, instabilidades de rede, interrupções de serviço ou ataques cibernéticos.
          {"\n\n"}
          Em nenhuma hipótese o Super Palpite será responsável por perdas indiretas, lucros cessantes, expectativa de ganho, perda de oportunidade ou qualquer valor superior ao montante efetivamente pago pelo participante no bilhete questionado, salvo determinação legal em sentido contrário.
        </Clausula>

        <Clausula n="10" titulo="Disposições Gerais">
          O Super Palpite reserva-se o direito de alterar este Regulamento a qualquer momento. As alterações entram em vigor imediatamente após sua publicação na plataforma.
          {"\n\n"}
          A decisão administrativa do Super Palpite será final no âmbito da plataforma, sem prejuízo dos direitos legais do participante.
          {"\n\n"}
          Fica eleito o foro da comarca de domicílio do Super Palpite para dirimir quaisquer controvérsias decorrentes deste Regulamento.
        </Clausula>

        <Clausula n="11" titulo="Elegibilidade, Conta e Identidade do Participante">
          A participação é pessoal, intransferível e condicionada à veracidade dos dados informados no momento do cadastro.
          {"\n\n"}
          O Super Palpite poderá solicitar, a qualquer momento, documentos ou informações adicionais para confirmação de identidade, titularidade da chave Pix, idade, regularidade do pagamento ou prevenção a fraudes.
          {"\n\n"}
          Caso o participante não forneça as informações solicitadas, forneça dados inconsistentes ou utilize dados de terceiros sem autorização, o Super Palpite poderá suspender ou cancelar sua participação, inclusive após o encerramento do bolão, sem prejuízo da retenção preventiva de valores até a conclusão da análise.
          {"\n\n"}
          É vedada a participação por menores de 18 anos, pessoas utilizando identidade falsa, dados de terceiros, documentos inválidos, chaves Pix de terceiros sem autorização ou qualquer mecanismo destinado a burlar as regras da plataforma.
        </Clausula>

        <Clausula n="12" titulo="Fraude, Abuso e Condutas Proibidas">
          São consideradas condutas proibidas, entre outras: (a) uso de múltiplas contas para manipular participação ou premiação; (b) tentativa de fraudar pagamentos, comprovantes ou resultados; (c) uso de robôs, scripts ou automações; (d) manipulação de dados cadastrais ou chaves Pix; (e) compartilhamento de acesso com terceiros; (f) tentativa de obter vantagem indevida; (g) ameaças, ofensas ou coação contra a equipe do Super Palpite ou outros participantes.
          {"\n\n"}
          Identificada qualquer suspeita razoável de fraude ou irregularidade, o Super Palpite poderá suspender a conta, bloquear o pagamento de prêmio, cancelar bilhetes e excluir o participante do bolão, até a conclusão da análise interna.
        </Clausula>

        <Clausula n="13" titulo="Erros Operacionais e Técnicos">
          Em caso de erro evidente de sistema, duplicidade, inconsistência de valores ou qualquer falha operacional, o Super Palpite poderá corrigir, suspender, cancelar ou invalidar bilhetes afetados.
          {"\n\n"}
          Quando o erro for causado exclusivamente pela plataforma e impossibilitar a participação válida do usuário, o Super Palpite poderá, a seu critério, cancelar o bilhete, devolver o valor pago ou transferir o valor para outro bolão equivalente.
          {"\n\n"}
          A existência de erro técnico não gera direito automático a prêmio, indenização, lucro cessante ou compensação adicional.
        </Clausula>

        <Clausula n="14" titulo="Prova de Pagamento e Confirmação do Bilhete">
          O envio de comprovante Pix pelo participante não garante, por si só, a validação do bilhete. A participação somente será considerada válida após a confirmação efetiva do pagamento no sistema do Super Palpite.
          {"\n\n"}
          Pagamentos feitos após o prazo, com valor divergente, duplicados, incompletos, para chave incorreta ou não identificados poderão ser rejeitados, estornados ou analisados manualmente.
          {"\n\n"}
          O participante é responsável por verificar se seu bilhete consta como confirmado na plataforma antes do encerramento dos palpites.
        </Clausula>

        <Clausula n="15" titulo="Contestação de Resultado">
          O participante poderá contestar o resultado ou a apuração do bolão no prazo máximo de 24 horas após a publicação do resultado na plataforma, pelo canal oficial de atendimento.
          {"\n\n"}
          A contestação deverá conter: identificação do participante, bolão, bilhete, palpite realizado e motivo. Após o prazo de 24 horas, o resultado será considerado definitivo para todos os fins internos da plataforma.
        </Clausula>

        <Clausula n="16" titulo="Fonte Oficial do Resultado">
          Para fins de apuração, o resultado considerado será o placar oficial ao término do tempo regulamentar, conforme divulgado pela entidade organizadora da competição.
          {"\n\n"}
          Correções posteriores, decisões disciplinares, anulação de partida ou punições administrativas não modificarão automaticamente a premiação já apurada, salvo decisão expressa do Super Palpite antes do pagamento do prêmio.
        </Clausula>

        <Clausula n="17" titulo="Verificações Antifraude no Pagamento de Prêmios">
          O pagamento de prêmios poderá ser condicionado à verificação cadastral, confirmação de identidade, titularidade da chave Pix e inexistência de fraude ou violação deste Regulamento.
          {"\n\n"}
          O prazo de pagamento poderá ser suspenso enquanto houver análise de segurança, suspeita de fraude, instabilidade bancária ou necessidade de validação adicional.
          {"\n\n"}
          O Super Palpite não se responsabiliza por atraso causado por dados incorretos, chave Pix inválida, bloqueios bancários, limites da instituição financeira do participante ou indisponibilidade do sistema Pix.
        </Clausula>

        <Clausula n="18" titulo="Limitação de Responsabilidade">
          O Super Palpite não será responsável por prejuízos decorrentes de: (a) erro de preenchimento de dados pelo participante; (b) falha de conexão, aparelho, navegador ou internet do participante; (c) indisponibilidade temporária de serviços de terceiros; (d) instabilidades no Pix, bancos ou gateways de pagamento; (e) eventos esportivos, decisões arbitrais ou administrativas; (f) uso indevido da conta por terceiros; (g) tentativa de participação após o prazo de encerramento.
        </Clausula>

        <Clausula n="19" titulo="Política de Reembolso e Cancelamento de Bilhetes">
          Após a confirmação do pagamento e validação do bilhete, o participante não poderá cancelar voluntariamente o palpite nem solicitar reembolso por arrependimento, erro de escolha de placar, mudança de opinião ou oscilação de expectativas.
          {"\n\n"}
          Pedidos de reembolso somente serão analisados em hipóteses excepcionais, como cobrança duplicada comprovada, pagamento não vinculado a bilhete válido, erro operacional reconhecido pelo Super Palpite ou cancelamento do bolão por decisão da plataforma antes do início da partida.
          {"\n\n"}
          A eventual concessão de reembolso em um caso específico não cria obrigação de reembolso em casos futuros.
        </Clausula>

        <Clausula n="20" titulo="Comunicação Oficial">
          As comunicações oficiais do Super Palpite ocorrem por meio da própria plataforma, WhatsApp e e-mail cadastrados pelo participante.
          {"\n\n"}
          É responsabilidade do participante manter seus dados de contato atualizados e acompanhar as informações relativas ao bolão, incluindo status do bilhete, resultado e premiação.
          {"\n\n"}
          Mensagens enviadas por perfis, números ou páginas não oficiais não representam o Super Palpite.
        </Clausula>

        <Clausula n="21" titulo="Regras Específicas por Bolão">
          Cada bolão poderá possuir regras específicas, como valor do bilhete, percentual destinado à premiação, taxa de administração, prêmio mínimo, data de encerramento e critérios de apuração.
          {"\n\n"}
          Em caso de conflito entre o Regulamento Geral e as regras específicas publicadas na página do bolão, prevalecerão as regras específicas, desde que informadas antes da confirmação do pagamento.
        </Clausula>

        <Clausula n="22" titulo="Jogo Responsável">
          O Super Palpite é uma plataforma de entretenimento e deve ser utilizado de forma consciente e responsável.
          {"\n\n"}
          O participante reconhece que a participação envolve risco de perda integral do valor pago pelo bilhete, não havendo garantia de retorno financeiro.
          {"\n\n"}
          O Super Palpite poderá limitar, suspender ou recusar a participação de usuários que demonstrem comportamento incompatível com o entretenimento responsável.
        </Clausula>

      </div>

      <div className="mt-10 rounded-xl border border-zinc-800 bg-sp-dark p-5 text-center">
        <p className="text-xs text-zinc-500">
          Ao participar de qualquer bolão no Super Palpite, o usuário confirma que leu, compreendeu e aceita integralmente este Regulamento.
        </p>
      </div>
    </section>
  );
}

function Clausula({ n, titulo, children }: { n: string; titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 text-base font-black text-sp-gold">
        {n}. {titulo}
      </h2>
      <div className="whitespace-pre-line">{children}</div>
    </div>
  );
}
