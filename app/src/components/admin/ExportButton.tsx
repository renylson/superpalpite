'use client';

import { Button } from '@/components/ui/Button';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export function ExportButton({ poolId }: { poolId: string }) {
  async function exportFile() {
    const { data } = await createBrowserSupabaseClient().auth.getSession();
    const response = await fetch(`/api/admin/exportar?pool_id=${poolId}`, {
      headers: { Authorization: `Bearer ${data.session?.access_token ?? ''}` },
    });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `superpalpite-${poolId}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return <Button type="button" onClick={exportFile}>Exportar Excel</Button>;
}

