import { notFound } from 'next/navigation';

import { listCmsPages } from '@comm-platform/coding/server';

import { upsertCmsPageAction } from '../../catalog-actions';

export const dynamic = 'force-dynamic';

export default async function EditCmsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = (await listCmsPages()).find((p) => p.id === id);
  if (!page) notFound();

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-10">
      <a className="text-sm text-[var(--color-primary)]" href="/admin/cms">
        ← Pages
      </a>
      <h1 className="text-3xl font-semibold">Update page</h1>
      <form action={upsertCmsPageAction} className="grid gap-3 rounded-2xl border p-6">
        <input type="hidden" name="id" value={page.id} />
        <input name="title" defaultValue={page.title} required className="rounded-xl border px-3 py-2" />
        <input name="slug" defaultValue={page.slug} className="rounded-xl border px-3 py-2" />
        <textarea name="body" defaultValue={page.body} className="min-h-40 rounded-xl border px-3 py-2" />
        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" defaultChecked={page.published} /> Published
        </label>
        <button className="w-fit rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
          Update page
        </button>
      </form>
    </main>
  );
}
