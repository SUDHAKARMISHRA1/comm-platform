import { upsertFeedPostAction } from '../../catalog-actions';
import type { FeedPostRecord } from '@comm-platform/coding';

export function FeedPostForm({ post }: { post?: FeedPostRecord }) {
  return (
    <form action={upsertFeedPostAction} className="grid gap-3 rounded-2xl border p-6">
      {post?.id ? <input type="hidden" name="id" value={post.id} /> : null}
      <label className="grid gap-1 text-sm">
        Type
        <select name="kind" defaultValue={post?.kind ?? 'article'} className="rounded-xl border px-3 py-2">
          <option value="article">Article</option>
          <option value="post">Post</option>
          <option value="video">Video</option>
          <option value="link">Link</option>
        </select>
      </label>
      <input name="title" defaultValue={post?.title} placeholder="Title" required className="rounded-xl border px-3 py-2" />
      <input
        name="authorName"
        defaultValue={post?.authorName ?? 'Comm Platform'}
        placeholder="Author name"
        className="rounded-xl border px-3 py-2"
      />
      <textarea
        name="body"
        defaultValue={post?.body}
        placeholder="Write the post. Learners will like, comment, and share this on Highlights."
        className="min-h-40 rounded-xl border px-3 py-2"
      />
      <input
        name="mediaUrl"
        defaultValue={post?.mediaUrl}
        placeholder="Image URL or YouTube URL"
        className="rounded-xl border px-3 py-2"
      />
      <input
        name="linkUrl"
        defaultValue={post?.linkUrl}
        placeholder="Optional outbound link"
        className="rounded-xl border px-3 py-2"
      />
      <label className="flex items-center gap-2 text-sm">
        <input name="published" type="checkbox" defaultChecked={post?.published ?? true} /> Publish to Highlights
      </label>
      <button className="w-fit rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
        {post ? 'Update post' : 'Save post'}
      </button>
    </form>
  );
}
