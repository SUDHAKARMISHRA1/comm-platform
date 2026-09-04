import { notFound } from 'next/navigation';

import { getFeedPostAdmin } from '@comm-platform/coding/server';

import { FeedCommentModeration } from '../comment-moderation';
import { FeedPostEditor } from '../feed-editor';

export const dynamic = 'force-dynamic';

export default async function FeedPostAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getFeedPostAdmin(id);
  if (!data) notFound();
  const { post, stats, comments } = data;

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <a className="text-sm text-[var(--color-primary)]" href="/admin/feed">
        ← Feed
      </a>
      <div>
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {post.published ? 'Published' : 'Draft'} · {post.kind} · {post.authorName}
        </p>
      </div>
      <section className="grid gap-3 sm:grid-cols-4">
        <Stat label="Likes" value={stats.likeCount} />
        <Stat label="Comments" value={stats.commentCount} />
        <Stat label="Replies" value={stats.replyCount} />
        <Stat label="Shares" value={stats.shareCount} />
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Update post</h2>
        <FeedPostEditor post={post} />
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Comments and replies</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Hidden items stay in this list but are removed from the Highlights page until you show them again.
        </p>
        <FeedCommentModeration postId={post.id} comments={comments} />
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-2xl border p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </article>
  );
}
