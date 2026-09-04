import { FeedPostEditor } from '../feed-editor';

export const dynamic = 'force-dynamic';

export default function NewFeedPost() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-10">
      <a className="text-sm text-[var(--color-primary)]" href="/admin/feed">
        ← Feed
      </a>
      <div>
        <h1 className="text-3xl font-semibold">Publish to Highlights</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Write the title and description, then add images, a slideshow, or video. Published posts appear on Highlights immediately.
        </p>
      </div>
      <FeedPostEditor />
    </main>
  );
}
