import { FeedPostForm } from '../feed-form';

export default function NewFeedPost() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-10">
      <a className="text-sm text-[var(--color-primary)]" href="/admin/feed">
        ← Feed
      </a>
      <h1 className="text-3xl font-semibold">Publish to Highlights</h1>
      <FeedPostForm />
    </main>
  );
}
