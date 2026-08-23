import { notFound } from 'next/navigation';

import { mapAdminUser } from '@comm-platform/api';

import { requireAdmin } from '@/lib/require-admin';
import { createServiceSupabase } from '@/lib/supabase/service';

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const service = createServiceSupabase();
  const { data } = await service.from('admin_user_overview').select('*').eq('id', id).maybeSingle();
  if (!data) {
    notFound();
  }
  const user = mapAdminUser(data);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <a href="/admin" className="text-sm text-[var(--color-primary)]">
        Back to users
      </a>
      <h1 className="mt-4 text-3xl font-semibold">{user.displayName ?? user.username}</h1>
      <dl className="mt-6 space-y-3 text-sm">
        <div>
          <dt className="text-[var(--color-text-muted)]">Username</dt>
          <dd>@{user.username}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-muted)]">Email</dt>
          <dd>{user.email ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-muted)]">Bio</dt>
          <dd>{user.bio || '—'}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-muted)]">Role</dt>
          <dd>{user.role}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-muted)]">Status</dt>
          <dd className="capitalize">{user.accountStatus}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-muted)]">Created</dt>
          <dd>{new Date(user.createdAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-text-muted)]">Last sign-in</dt>
          <dd>{user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : 'Never'}</dd>
        </div>
      </dl>
      <p className="mt-8 text-sm text-[var(--color-text-muted)]">
        Passwords, tokens, and service keys are never shown here. Admin writes are recorded in{' '}
        <code>audit_logs</code>.
      </p>
    </main>
  );
}
