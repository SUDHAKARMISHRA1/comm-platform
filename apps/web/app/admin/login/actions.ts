'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { toUserMessage } from '@comm-platform/api';
import { signInSchema } from '@comm-platform/validation';

import { resolveAdminAccess } from '@/lib/admin-access';
import { createServerSupabase } from '@/lib/supabase/server';

export async function adminLogin(_prev: { error?: string } | undefined, formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check the form and try again.' };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: toUserMessage(error) };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: roleRow } = user
    ? await supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle()
    : { data: null };

  if (resolveAdminAccess({ userId: user?.id, role: roleRow?.role }) !== 'allowed') {
    await supabase.auth.signOut();
    return { error: 'This account is not an admin.' };
  }

  revalidatePath('/admin', 'layout');
  redirect('/admin');
}

export async function adminLogout() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}
