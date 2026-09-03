import { listFeedPosts } from '@comm-platform/coding/server';

import { removeFeedPostAction } from '../catalog-actions';

export const dynamic = 'force-dynamic';

export default async function FeedPostsPage() {
  const posts = await listFeedPosts();
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Highlights feed</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Published posts appear on Highlights after Difficulty mix and Latest verdicts.
          </p>
        </div>
        <a className="text-sm text-[var(--color-primary)]" href="/admin/feed/new">
          Publish post
        </a>
      </div>
      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3 capitalize">{post.kind}</td>
                <td className="px-4 py-3">{post.published ? 'Published' : 'Draft'}</td>
                <td className="flex gap-3 px-4 py-3">
                  <a className="text-[var(--color-primary)]" href={`/admin/feed/${post.id}`}>
                    Update
                  </a>
                  <form action={removeFeedPostAction}>
                    <input type="hidden" name="id" value={post.id} />
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
