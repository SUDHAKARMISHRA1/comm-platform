import { upsertCmsPageAction } from '../../catalog-actions';

export default function NewCmsPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-10">
      <a className="text-sm text-[var(--color-primary)]" href="/admin/cms">
        ← Pages
      </a>
      <h1 className="text-3xl font-semibold">Add and publish page</h1>
      <form action={upsertCmsPageAction} className="grid gap-3 rounded-2xl border p-6">
        <input name="title" placeholder="Title" required className="rounded-xl border px-3 py-2" />
        <input name="slug" placeholder="slug (optional)" className="rounded-xl border px-3 py-2" />
        <textarea name="body" placeholder="Page body" className="min-h-40 rounded-xl border px-3 py-2" />
        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" defaultChecked /> Publish now
        </label>
        <button className="w-fit rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
          Save page
        </button>
      </form>
    </main>
  );
}
