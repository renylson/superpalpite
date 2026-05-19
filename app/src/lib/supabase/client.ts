import { createClient } from '@supabase/supabase-js';

let browserSupabaseClient: ReturnType<typeof createClient> | null = null;

export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Supabase público não configurado. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  browserSupabaseClient ??= createClient(url, anonKey);
  return browserSupabaseClient;
}
