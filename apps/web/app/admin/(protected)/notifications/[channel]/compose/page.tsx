import { notFound } from 'next/navigation';

import type { NotificationChannel } from '@comm-platform/coding';

import { saveDraftNotificationAction, upsertNotificationAction } from '../../../catalog-actions';

type Props = { params: Promise<{ channel: string }> };

export default async function ComposeNotificationPage({ params }: Props) {
  const { channel } = await params;
  if (channel !== 'email' && channel !== 'push') notFound();
  const ch = channel as NotificationChannel;

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-10">
      <h1 className="text-3xl font-semibold capitalize">Compose {ch} campaign</h1>
      <p className="text-sm text-[var(--color-text-muted)]">
        Choose a user group. Published campaigns are stored and returned to the app catalog for that audience.
      </p>
      <form className="grid gap-3 rounded-2xl border p-6">
        <input type="hidden" name="channel" value={ch} />
        <input name="title" placeholder="Title" required className="rounded-xl border px-3 py-2" />
        <textarea name="body" placeholder="Message" required className="min-h-32 rounded-xl border px-3 py-2" />
        <select name="audience" className="rounded-xl border px-3 py-2" defaultValue="all">
          <option value="all">All users</option>
          <option value="active">Active users</option>
          <option value="inactive">Inactive users</option>
        </select>
        <div className="flex gap-3">
          <button formAction={saveDraftNotificationAction} className="rounded-xl border px-4 py-2" type="submit">
            Save draft
          </button>
          <button
            name="intent"
            value="publish"
            formAction={upsertNotificationAction}
            className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white"
            type="submit"
          >
            Publish
          </button>
        </div>
      </form>
    </main>
  );
}
