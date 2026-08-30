import { listTopics } from '@comm-platform/coding/server';

import { removeTopicAction, upsertTopicAction } from '../catalog-actions';

export const dynamic = 'force-dynamic';

export default async function TopicsListPage() {
  const topics = await listTopics();
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Topics</h1>
        <a className="text-sm text-[var(--color-primary)]" href="/admin/topics/new">
          Add topic
        </a>
      </div>
      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.id} className="border-t">
                <td className="px-4 py-3">
                  <form action={upsertTopicAction} className="flex gap-2">
                    <input type="hidden" name="id" value={topic.id} />
                    <input name="name" defaultValue={topic.name} required className="rounded-lg border px-2 py-1" />
                    <button className="text-[var(--color-primary)]" type="submit">
                      Update
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <form action={removeTopicAction}>
                    <input type="hidden" name="id" value={topic.id} />
                    <button className="text-red-600" type="submit">
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
