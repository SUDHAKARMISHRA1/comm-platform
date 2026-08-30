import { upsertLevelAction } from '../../catalog-actions';

export default function AddLevelPage() {
  return (
    <main className="mx-auto max-w-xl space-y-6 px-6 py-10">
      <a className="text-sm text-[var(--color-primary)]" href="/admin/levels">
        ← Level list
      </a>
      <h1 className="text-3xl font-semibold">Add level</h1>
      <form action={upsertLevelAction} className="grid gap-3 rounded-2xl border bg-[var(--color-surface)] p-6">
        <input name="name" placeholder="Level name" required className="rounded-xl border px-3 py-2" />
        <select name="band" className="rounded-xl border px-3 py-2" defaultValue="EASY">
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <button className="w-fit rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
          Create level
        </button>
      </form>
    </main>
  );
}
