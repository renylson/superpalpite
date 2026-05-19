'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  async function login(formData: FormData) {
    setError('');
    const supabase = createBrowserSupabaseClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: String(formData.get('email')),
      password: String(formData.get('password')),
    });
    if (loginError) setError('E-mail ou senha inválidos.');
    else window.location.href = '/admin/dashboard';
  }
  return (
    <Card className="mx-auto max-w-md">
      <h2 className="text-2xl font-black">Entrar</h2>
      <form action={login} className="mt-4 space-y-3">
        <Input name="email" type="email" placeholder="E-mail" required />
        <Input name="password" type="password" placeholder="Senha" required />
        {error ? <p className="text-sm text-sp-error">{error}</p> : null}
        <Button className="w-full">Acessar painel</Button>
      </form>
    </Card>
  );
}

