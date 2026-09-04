import { listFeedPostsWithStats } from '@comm-platform/coding/server';

import { removeFeedPostAction } from '../catalog-actions';

export const dynamic = 'force-dynamic';

export default async function FeedPostsPage() {
  const posts = await listFeedPostsWithStats();
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Highlights feed</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Manage every post learners see on Highlights. Open a post for likes, comments, replies, and hide controls.
          </p>
        </div>
        <a className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white" href="/admin/feed/new">
          Publish post
        </a>
      </div>
      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Likes</th>
              <th className="px-4 py-3 text-left">Comments</th>
              <th className="px-4 py-3 text-left">Replies</th>
              <th className="px-4 py-3 text-left">Shares</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-[var(--color-text-muted)]" colSpan={7}>
                  No posts yet. Publish the first one for Highlights.
                </td>
              </tr>
            ) : null}
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{post.title}</div>
                  <div className="text-xs capitalize text-[var(--color-text-muted)]">{post.kind}</div>
                </td>
                <td className="px-4 py-3">{post.published ? 'Published' : 'Draft'}</td>
                <td className="px-4 py-3">{post.likeCount}</td>
                <td className="px-4 py-3">{post.commentCount}</td>
                <td className="px-4 py-3">{post.replyCount}</td>
                <td className="px-4 py-3">{post.shareCount}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    <a className="text-[var(--color-primary)]" href={`/admin/feed/${post.id}`}>
                      Analytics
                    </a>
                    <form action={removeFeedPostAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <button className="text-[var(--color-danger)]" type="submit">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
