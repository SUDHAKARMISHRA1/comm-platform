import { redirect } from 'next/navigation';

import { resolveAdminAccess } from '@/lib/admin-access';
import { createServerSupabase } from '@/lib/supabase/server';

export async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/admin/login');
  }

  const { data: roleRow } = await supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle();

  const access = resolveAdminAccess({ userId: user.id, role: roleRow?.role });
  if (access === 'forbidden') {
    redirect('/forbidden');
  }

  return { user };
}
