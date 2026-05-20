import { NextResponse } from 'next/server';

// Funcionalidade de envio por e-mail removida.
// O comprovante agora é gerado na tela do usuário em /comprovante/[key].
export async function POST() {
  return NextResponse.json({ error: 'Envio por e-mail não está mais disponível. Use o link do comprovante.' }, { status: 410 });
}
