'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { adminLogout } from '@/app/admin/login/actions';

type NavChild = { href: string; label: string };
type NavGroup = { id: string; label: string; href?: string; children?: NavChild[] };

const NAV: NavGroup[] = [
  { id: 'home', label: 'Dashboard', href: '/admin' },
  {
    id: 'users',
    label: 'User List',
    children: [
      { href: '/admin/users', label: 'All Users' },
      { href: '/admin/users?status=active', label: 'Active user list' },
      { href: '/admin/users?status=inactive', label: 'Inactive user list' },
    ],
  },
  {
    id: 'problems',
    label: 'Manage Problems',
    children: [
      { href: '/admin/practice', label: 'Manage Sections' },
      { href: '/admin/skills', label: 'Skills list' },
      { href: '/admin/skills/new', label: 'Add new skill' },
      { href: '/admin/levels', label: 'Level list' },
      { href: '/admin/levels/new', label: 'Add level' },
      { href: '/admin/topics', label: 'Topics list' },
      { href: '/admin/topics/new', label: 'Add topic' },
    ],
  },
  { id: 'submissions', label: 'Manage Submissions', href: '/admin/submissions' },
  { id: 'path', label: 'User Learning Path', href: '/admin/learning-path' },
  {
    id: 'crm',
    label: 'CRM',
    children: [
      { href: '/admin/cms/new', label: 'Add and publish page' },
      { href: '/admin/cms', label: 'Update page' },
      { href: '/admin/cms', label: 'Delete page' },
    ],
  },
  {
    id: 'email',
    label: 'Email',
    children: [
      { href: '/admin/notifications/email/drafts', label: 'Draft list' },
      { href: '/admin/notifications/email/published', label: 'Published list' },
      { href: '/admin/notifications/email/compose', label: 'Compose and publish' },
    ],
  },
  {
    id: 'push',
    label: 'Push',
    children: [
      { href: '/admin/notifications/push/drafts', label: 'Draft list' },
      { href: '/admin/notifications/push/published', label: 'Published list' },
      { href: '/admin/notifications/push/compose', label: 'Compose and publish' },
    ],
  },
  { id: 'settings', label: 'Setting', href: '/admin/settings' },
];

function pathActive(pathname: string, href: string) {
  const path = href.split('?')[0] ?? href;
  if (path === '/admin') return pathname === '/admin';
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({
    users: true,
    problems: true,
    crm: true,
    email: true,
    push: true,
  });

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 shrink-0 flex-col bg-[var(--color-navy)] text-white">
        <a href="/admin" className="border-b border-white/10 px-4 py-4 font-semibold">
          Comm Platform admin
        </a>
        <nav className="flex-1 overflow-y-auto px-2 py-3 text-sm">
          {NAV.map((item) => {
            if (item.href && !item.children) {
              const active = pathActive(pathname, item.href);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`mb-0.5 block rounded-lg px-3 py-2 ${active ? 'bg-white/15 font-semibold' : 'text-white/85 hover:bg-white/10'}`}
                >
                  {item.label}
                </a>
              );
            }
            const expanded = open[item.id] ?? false;
            return (
              <div key={item.id} className="mb-1">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-white/90 hover:bg-white/10"
                  onClick={() => setOpen((prev) => ({ ...prev, [item.id]: !expanded }))}
                >
                  <span>{item.label}</span>
                  <span className="text-xs">{expanded ? '▾' : '▸'}</span>
                </button>
                {expanded ? (
                  <div className="ml-2 border-l border-white/15 pl-2">
                    {item.children?.map((child) => {
                      const active = pathActive(pathname, child.href);
                      return (
                        <a
                          key={`${child.href}-${child.label}`}
                          href={child.href}
                          className={`mb-0.5 block rounded-lg px-3 py-1.5 ${active ? 'bg-white/15 font-semibold' : 'text-white/80 hover:bg-white/10'}`}
                        >
                          {child.label}
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
        <form action={adminLogout} className="border-t border-white/10 p-3">
          <button className="w-full rounded-lg bg-[var(--color-navy-muted)] px-3 py-2 text-sm font-semibold" type="submit">
            Logout
          </button>
        </form>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
