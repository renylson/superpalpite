import { createClient } from '@supabase/supabase-js';

export function createServiceSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Supabase server não configurado. Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.');
  }
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function assertAdmin(authorization: string | null) {
  if (!authorization) throw new Error('Login administrativo obrigatório.');
  const token = authorization.replace('Bearer ', '');
  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.email) throw new Error('Sessão administrativa inválida.');
  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', data.user.email)
    .eq('role', 'admin')
    .single();
  if (adminError || !admin) throw new Error('Usuário sem permissão administrativa.');
  return admin;
}

