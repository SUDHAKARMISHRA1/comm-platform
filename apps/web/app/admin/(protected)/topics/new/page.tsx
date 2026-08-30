import { upsertTopicAction } from '../../catalog-actions';

export default function AddTopicPage() {
  return (
    <main className="mx-auto max-w-xl space-y-6 px-6 py-10">
      <a className="text-sm text-[var(--color-primary)]" href="/admin/topics">
        ← Topics list
      </a>
      <h1 className="text-3xl font-semibold">Add topic</h1>
      <form action={upsertTopicAction} className="grid gap-3 rounded-2xl border bg-[var(--color-surface)] p-6">
        <input name="name" placeholder="Topic name (e.g. Array)" required className="rounded-xl border px-3 py-2" />
        <button className="w-fit rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
          Create topic
        </button>
      </form>
    </main>
  );
}
