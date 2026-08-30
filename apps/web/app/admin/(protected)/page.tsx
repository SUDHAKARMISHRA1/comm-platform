import { mapAdminUser } from '@comm-platform/api';
import { getCatalog, listAdminSubmissions, listQuestionsAdmin } from '@comm-platform/coding/server';
import type { AdminUserOverview } from '@comm-platform/types';

import { createServiceSupabase } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

function daysAgo(n: number) {
  return Date.now() - n * 24 * 60 * 60 * 1000;
}

async function loadUsers(): Promise<AdminUserOverview[]> {
  try {
    const service = createServiceSupabase();
    const { data } = await service.from('admin_user_overview').select('*').order('created_at', { ascending: false });
    return (data ?? []).map(mapAdminUser);
  } catch {
    return [];
  }
}

export default async function AdminDashboardPage() {
  const [users, submissions, questions, catalog] = await Promise.all([
    loadUsers(),
    listAdminSubmissions(),
    listQuestionsAdmin(),
    getCatalog(),
  ]);

  const now = Date.now();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const lastMonthStart = new Date(monthStart);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

  const newRegistrations = users.filter((u) => new Date(u.createdAt).getTime() >= daysAgo(30)).length;
  const newThisMonth = users.filter((u) => new Date(u.createdAt).getTime() >= monthStart.getTime()).length;
  const newLastMonth = users.filter((u) => {
    const t = new Date(u.createdAt).getTime();
    return t >= lastMonthStart.getTime() && t < monthStart.getTime();
  }).length;
  const activeUsers = users.filter(
    (u) => u.accountStatus === 'active' && u.lastSignInAt && new Date(u.lastSignInAt).getTime() >= daysAgo(30),
  ).length;
  const inactiveUsers = users.filter((u) => u.accountStatus !== 'active').length;
  const accepted = submissions.filter((s) => s.status === 'ACCEPTED').length;
  const acceptanceRate = submissions.length ? Math.round((accepted / submissions.length) * 100) : 0;
  const publishedProblems = questions.filter((q) => q.published).length;
  const drafts = questions.length - publishedProblems;
  const submissionsThisMonth = submissions.filter((s) => new Date(s.createdAt).getTime() >= monthStart.getTime()).length;

  const counts = new Map<string, { count: number; accepted: number }>();
  for (const s of submissions) {
    const row = counts.get(s.userId) ?? { count: 0, accepted: 0 };
    row.count += 1;
    if (s.status === 'ACCEPTED') row.accepted += 1;
    counts.set(s.userId, row);
  }
  const userById = new Map(users.map((u) => [u.id, u]));
  const topSubmitters = [...counts.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([userId, stats]) => {
      const user = userById.get(userId);
      return {
        userId,
        name: user?.displayName ?? user?.username ?? userId.slice(0, 8),
        username: user?.username,
        ...stats,
      };
    });

  const bySkill = catalog.skills.map((skill) => ({
    name: skill.name,
    count: questions.filter((q) => q.skillId === skill.id).length,
  }));

  const cards = [
    { label: 'Newly registered (30d)', value: newRegistrations },
    { label: 'Active users (30d)', value: activeUsers },
    { label: 'Total submissions', value: submissions.length },
    { label: 'Registered users', value: users.length },
    { label: 'Acceptance rate', value: `${acceptanceRate}%` },
    { label: 'Submissions this month', value: submissionsThisMonth },
    { label: 'Published problems', value: publishedProblems },
    { label: 'Draft problems', value: drafts },
    { label: 'Inactive / unconfirmed', value: inactiveUsers },
    { label: 'New this month', value: newThisMonth },
    { label: 'New last month', value: newLastMonth },
    { label: 'Skills in catalog', value: catalog.skills.length },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Analytics</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Live counts from registered accounts, problem catalog, and submissions.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-sm text-[var(--color-text-muted)]">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top submitters</h2>
            <a className="text-sm text-[var(--color-primary)]" href="/admin/submissions">
              View all
            </a>
          </div>
          {topSubmitters.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--color-text-muted)]">No submissions yet.</p>
          ) : (
            <ol className="mt-4 space-y-3 text-sm">
              {topSubmitters.map((row, index) => (
                <li key={row.userId} className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                  <div>
                    <span className="mr-2 text-[var(--color-text-muted)]">{index + 1}.</span>
                    <a className="text-[var(--color-primary)]" href={`/admin/users/${row.userId}`}>
                      {row.name}
                    </a>
                    {row.username ? <span className="ml-2 text-[var(--color-text-muted)]">@{row.username}</span> : null}
                  </div>
                  <span>
                    {row.count} submissions · {row.accepted} accepted
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-lg font-semibold">Problems by skill</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {bySkill.map((row) => (
              <li key={row.name} className="flex justify-between">
                <span>{row.name}</span>
                <span className="font-semibold">{row.count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-[var(--color-text-muted)]">
            Snapshot generated {new Date(now).toLocaleString()}. Retention of inactive users and monthly registrations help
            plan outreach and content.
          </p>
        </div>
      </section>
    </main>
  );
}
