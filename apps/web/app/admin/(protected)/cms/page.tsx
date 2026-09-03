import { listCmsPages } from '@comm-platform/coding/server';

import { removeCmsPageAction } from '../catalog-actions';

export const dynamic = 'force-dynamic';

export default async function CmsPagesPage() {
  const pages = await listCmsPages();
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">CRM pages</h1>
        <a className="text-sm text-[var(--color-primary)]" href="/admin/cms/new">
          Add and publish page
        </a>
      </div>
      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-t">
                <td className="px-4 py-3">{page.title}</td>
                <td className="px-4 py-3">{page.slug}</td>
                <td className="px-4 py-3">{page.published ? 'Published' : 'Draft'}</td>
                <td className="px-4 py-3 flex gap-3">
                  <a className="text-[var(--color-primary)]" href={`/admin/cms/${page.id}`}>
                    Update
                  </a>
                  <form action={removeCmsPageAction}>
                    <input type="hidden" name="id" value={page.id} />
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
