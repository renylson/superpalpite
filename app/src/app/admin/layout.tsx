import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-black">Painel Admin</h1>
        <nav className="flex flex-wrap gap-3 text-sm font-bold text-sp-gold">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/jogos">Jogos</Link>
          <Link href="/admin/boloes">Bolões</Link>
          <Link href="/admin/palpites">Palpites</Link>
        </nav>
      </div>
      {children}
    </section>
  );
}

