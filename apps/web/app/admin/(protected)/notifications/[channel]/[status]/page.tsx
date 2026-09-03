import { notFound } from 'next/navigation';

import { listNotifications } from '@comm-platform/coding/server';
import type { NotificationChannel } from '@comm-platform/coding';

import { removeNotificationAction, upsertNotificationAction } from '../../../catalog-actions';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ channel: string; status: string }> };

export default async function NotificationListPage({ params }: { params: Props['params'] }) {
  const { channel, status } = await params;
  if (channel !== 'email' && channel !== 'push') notFound();
  if (status !== 'drafts' && status !== 'published') notFound();
  const ch = channel as NotificationChannel;
  const rows = await listNotifications(ch, status === 'drafts' ? 'draft' : 'published');

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold capitalize">
          {channel} · {status}
        </h1>
        <a className="text-sm text-[var(--color-primary)]" href={`/admin/notifications/${channel}/compose`}>
          Compose and publish
        </a>
      </div>
      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Audience</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-3">{row.title}</td>
                <td className="px-4 py-3 capitalize">{row.audience}</td>
                <td className="px-4 py-3">{new Date(row.publishedAt ?? row.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 flex gap-3">
                  {row.status === 'draft' ? (
                    <form action={upsertNotificationAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="channel" value={channel} />
                      <input type="hidden" name="title" value={row.title} />
                      <input type="hidden" name="body" value={row.body} />
                      <input type="hidden" name="audience" value={row.audience} />
                      <input type="hidden" name="intent" value="publish" />
                      <button className="text-[var(--color-primary)]" type="submit">
                        Publish
                      </button>
                    </form>
                  ) : null}
                  <form action={removeNotificationAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="channel" value={channel} />
                    <button className="text-[var(--color-danger)]" type="submit">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
