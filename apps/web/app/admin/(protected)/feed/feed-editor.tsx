'use client';

import { useMemo, useState } from 'react';

import { upsertFeedPostAction } from '../catalog-actions';

type BlockKind = 'text' | 'image' | 'video' | 'slideshow';
type EditorBlock = {
  id: string;
  kind: BlockKind;
  text?: string;
  url?: string;
  urls?: string[];
  caption?: string;
};

export type FeedEditorPost = {
  id?: string;
  kind?: string;
  title?: string;
  body?: string;
  mediaUrl?: string;
  linkUrl?: string;
  authorName?: string;
  published?: boolean;
  blocks?: EditorBlock[];
};

function newId() {
  return `blk-${Math.random().toString(36).slice(2, 10)}`;
}

function initialBlocks(post?: FeedEditorPost): EditorBlock[] {
  if (post?.blocks?.length) return post.blocks.map((block) => ({ ...block, id: block.id || newId() }));
  const blocks: EditorBlock[] = [];
  if (post?.body?.trim()) blocks.push({ id: newId(), kind: 'text', text: post.body });
  const media = post?.mediaUrl?.trim();
  if (media) {
    const video = /youtube|youtu\.be|vimeo|\.mp4/i.test(media);
    blocks.push({ id: newId(), kind: video ? 'video' : 'image', url: media });
  }
  if (!blocks.length) blocks.push({ id: newId(), kind: 'text', text: '' });
  return blocks;
}

const field = 'w-full rounded-xl border px-3 py-2 bg-white';

export function FeedPostEditor({ post }: { post?: FeedEditorPost }) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(() => initialBlocks(post));
  const payload = useMemo(() => JSON.stringify(blocks), [blocks]);

  function update(id: string, patch: Partial<EditorBlock>) {
    setBlocks((current) => current.map((block) => (block.id === id ? { ...block, ...patch } : block)));
  }

  function add(kind: BlockKind) {
    const next: EditorBlock =
      kind === 'slideshow'
        ? { id: newId(), kind, urls: [''] }
        : kind === 'text'
          ? { id: newId(), kind, text: '' }
          : { id: newId(), kind, url: '' };
    setBlocks((current) => [...current, next]);
  }

  return (
    <form action={upsertFeedPostAction} className="grid gap-4 rounded-2xl border p-6">
      {post?.id ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="blocks" value={payload} />
      <label className="grid gap-1 text-sm">
        Type
        <select name="kind" defaultValue={post?.kind ?? 'article'} className={field}>
          <option value="article">Article</option>
          <option value="post">Post</option>
          <option value="video">Video</option>
          <option value="link">Link</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        Title
        <input name="title" defaultValue={post?.title} placeholder="Title" required className={field} />
      </label>
      <label className="grid gap-1 text-sm">
        Author
        <input name="authorName" defaultValue={post?.authorName ?? 'Comm Platform'} className={field} />
      </label>
      <label className="grid gap-1 text-sm">
        Optional outbound link
        <input name="linkUrl" defaultValue={post?.linkUrl} placeholder="https://" className={field} />
      </label>

      <div className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">Description</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <button type="button" className="rounded-lg border px-3 py-1" onClick={() => add('text')}>
              Add text
            </button>
            <button type="button" className="rounded-lg border px-3 py-1" onClick={() => add('image')}>
              Add image
            </button>
            <button type="button" className="rounded-lg border px-3 py-1" onClick={() => add('slideshow')}>
              Add slideshow
            </button>
            <button type="button" className="rounded-lg border px-3 py-1" onClick={() => add('video')}>
              Add video
            </button>
          </div>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          Learners see this on Highlights. Paste image, YouTube, or video URLs. Slideshows take one image URL per slide.
        </p>
        {blocks.map((block, index) => (
          <article key={block.id} className="grid gap-2 rounded-xl border bg-[var(--color-surface-muted,#f9fafb)] p-4">
            <div className="flex items-center justify-between gap-2 text-sm">
              <strong className="capitalize">{block.kind}</strong>
              <button
                type="button"
                className="text-[var(--color-danger)]"
                onClick={() => setBlocks((current) => current.filter((row) => row.id !== block.id))}
                disabled={blocks.length === 1}
              >
                Remove
              </button>
            </div>
            {block.kind === 'text' ? (
              <textarea
                className={`${field} min-h-32`}
                placeholder={index === 0 ? 'Write the description…' : 'Add more copy…'}
                value={block.text ?? ''}
                onChange={(event) => update(block.id, { text: event.target.value })}
              />
            ) : null}
            {block.kind === 'image' || block.kind === 'video' ? (
              <>
                <input
                  className={field}
                  placeholder={block.kind === 'video' ? 'YouTube or video URL' : 'Image URL'}
                  value={block.url ?? ''}
                  onChange={(event) => update(block.id, { url: event.target.value })}
                />
                <input
                  className={field}
                  placeholder="Optional caption"
                  value={block.caption ?? ''}
                  onChange={(event) => update(block.id, { caption: event.target.value })}
                />
              </>
            ) : null}
            {block.kind === 'slideshow' ? (
              <textarea
                className={`${field} min-h-24 font-mono text-sm`}
                placeholder={'One image URL per line'}
                value={(block.urls ?? []).join('\n')}
                onChange={(event) =>
                  update(block.id, {
                    urls: event.target.value.split(/\n+/).map((value) => value.trim()),
                  })
                }
              />
            ) : null}
          </article>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input name="published" type="checkbox" defaultChecked={post?.published ?? true} /> Publish to Highlights
      </label>
      <button className="w-fit rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
        {post?.id ? 'Update post' : 'Publish post'}
      </button>
    </form>
  );
}
