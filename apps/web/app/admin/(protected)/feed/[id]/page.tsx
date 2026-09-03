import { notFound } from 'next/navigation';

import { listFeedPosts } from '@comm-platform/coding/server';

import { FeedPostForm } from '../feed-form';

export const dynamic = 'force-dynamic';

export default async function EditFeedPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = (await listFeedPosts()).find((row) => row.id === id);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-10">
      <a className="text-sm text-[var(--color-primary)]" href="/admin/feed">
        ← Feed
      </a>
      <h1 className="text-3xl font-semibold">Update post</h1>
      <FeedPostForm post={post} />
    </main>
  );
}
