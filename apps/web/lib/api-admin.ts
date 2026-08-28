import { createServerSupabase } from '@/lib/supabase/server';
import { resolveAdminAccess } from '@/lib/admin-access';
import { NextResponse, type NextRequest } from 'next/server';

export async function requireAdminApi(_request?: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: roleRow } = user
    ? await supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle()
    : { data: null };

  const access = resolveAdminAccess({ userId: user?.id, role: roleRow?.role });
  if (access === 'unauthenticated') {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (access === 'forbidden') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { user: user! };
}
