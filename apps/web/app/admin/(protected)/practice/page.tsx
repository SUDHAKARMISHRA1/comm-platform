import { movePracticeSetDown, movePracticeSetUp, removePracticeSetAction, upsertPracticeSet } from './actions';
import { AdminHeader } from '@/components/admin-header';
import { loadPracticeSets } from '@/lib/coding-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SearchParams = Promise<{ q?: string }>;

export default async function AdminPracticePage({ searchParams }: { searchParams: SearchParams }) {
  await searchParams;
  const sets = await loadPracticeSets();

  return (
    <div>
      <AdminHeader active="practice" />
      <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <h1 className="text-3xl font-semibold">Practice sets</h1>

        <form action={upsertPracticeSet} className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="font-semibold">Create practice set</h2>
          <input name="title" placeholder="Title" required className="rounded-xl border px-3 py-2" />
          <input name="slug" placeholder="slug (optional)" className="rounded-xl border px-3 py-2" />
          <textarea name="description" placeholder="Description" className="rounded-xl border px-3 py-2" />
          <input name="topics" placeholder="Topics (comma-separated)" className="rounded-xl border px-3 py-2" />
          <input name="languages" defaultValue="java,c,cpp" className="rounded-xl border px-3 py-2" />
          <input name="sequence" type="number" defaultValue={sets.length + 1} className="rounded-xl border px-3 py-2" />
          <label className="flex items-center gap-2 text-sm"><input name="published" type="checkbox" defaultChecked /> Published</label>
          <button className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white w-fit" type="submit">Create set</button>
        </form>

        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--color-surface-muted)]">
              <tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Topics</th><th className="px-4 py-3">Published</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {sets.map((set) => (
                <tr key={set.id} className="border-t border-[var(--color-border)]">
                  <td className="px-4 py-3">{set.sequence}</td>
                  <td className="px-4 py-3"><a className="text-[var(--color-primary)]" href={`/admin/practice/${set.id}`}>{set.title}</a></td>
                  <td className="px-4 py-3">{set.topics.join(', ')}</td>
                  <td className="px-4 py-3">{set.published ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <form action={movePracticeSetUp}><input type="hidden" name="setId" value={set.id} /><button type="submit">↑</button></form>
                    <form action={movePracticeSetDown}><input type="hidden" name="setId" value={set.id} /><button type="submit">↓</button></form>
                    <form action={removePracticeSetAction}><input type="hidden" name="setId" value={set.id} /><button type="submit" className="text-red-600">Delete</button></form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
