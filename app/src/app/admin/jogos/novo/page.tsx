import { Card } from '@/components/ui/Card';
import { JogoForm } from '@/components/admin/JogoForm';

export default function NovoJogoPage() {
  return <Card className="max-w-xl"><h2 className="mb-4 text-2xl font-black">Novo jogo</h2><JogoForm /></Card>;
}

