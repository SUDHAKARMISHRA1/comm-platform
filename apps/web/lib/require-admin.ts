import { redirect } from 'next/navigation';

import { resolveAdminAccess } from '@/lib/admin-access';
import { createServerSupabase } from '@/lib/supabase/server';

export async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: roleRow } = user
    ? await supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle()
    : { data: null };

  const access = resolveAdminAccess({ userId: user?.id, role: roleRow?.role });
  if (access === 'unauthenticated') {
    redirect('/admin/login');
  }
  if (access === 'forbidden') {
    redirect('/forbidden');
  }

  return { user: user! };
}
