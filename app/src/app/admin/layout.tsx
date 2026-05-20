'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Medal, Calendar, Trophy, Ticket, Target, CreditCard, Wallet, UserCircle, Users, LogOut, Menu, X } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/competicoes', label: 'Competições', icon: Medal },
  { href: '/admin/jogos', label: 'Jogos', icon: Calendar },
  { href: '/admin/boloes', label: 'Bolões', icon: Trophy },
  { href: '/admin/bilhetes', label: 'Bilhetes', icon: Ticket },
  { href: '/admin/palpites', label: 'Palpites', icon: Target },
  { href: '/admin/pagamentos', label: 'Pagamentos', icon: CreditCard },
  { href: '/admin/caixa', label: 'Caixa', icon: Wallet },
  { href: '/admin/participantes', label: 'Cadastros', icon: UserCircle },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      return;
    }
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/admin/login');
      } else {
        setEmail(data.session.user.email ?? '');
        setChecking(false);
      }
    });
  }, [pathname, router]);

  async function logout() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
  }

  if (pathname === '/admin/login') return <>{children}</>;

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sp-black">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-sp-gold" />
          <p className="mt-4 text-zinc-400">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-sp-black">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-zinc-800 bg-sp-dark transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-zinc-800 px-4 py-4">
          <div className="flex items-center justify-end lg:hidden">
            <button className="text-zinc-400" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <Link href="/" className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Super Palpite" style={{ height: '8rem' }} className="w-auto object-contain" />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold transition ${
                  active
                    ? 'bg-sp-gold/10 text-sp-gold'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-sp-white'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800 p-3">
          {email && (
            <p className="mb-2 truncate px-3 text-xs text-zinc-500">{email}</p>
          )}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-zinc-400 transition hover:bg-red-950 hover:text-red-300"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="flex items-center gap-3 border-b border-zinc-800 bg-sp-dark px-4 py-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-zinc-400">
            <Menu size={22} />
          </button>
          <span className="font-black text-sp-gold">Painel Admin</span>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
