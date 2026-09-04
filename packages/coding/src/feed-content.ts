import type { FeedContentBlock } from './types';

const BLOCK_KINDS = new Set<FeedContentBlock['kind']>(['text', 'image', 'video', 'slideshow']);

function newId() {
  return `blk-${Math.random().toString(36).slice(2, 10)}`;
}

function isVideoUrl(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com|\.mp4($|\?)/i.test(url);
}

export function parseFeedBlocks(raw: unknown): FeedContentBlock[] {
  const source = typeof raw === 'string' ? (() => {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return [];
    }
  })() : raw;
  if (!Array.isArray(source)) return [];
  const mapped: FeedContentBlock[] = [];
  source.forEach((row, index) => {
    if (!row || typeof row !== 'object') return;
    const item = row as Record<string, unknown>;
    const kind = BLOCK_KINDS.has(item.kind as FeedContentBlock['kind'])
      ? (item.kind as FeedContentBlock['kind'])
      : null;
    if (!kind) return;
    const urls = Array.isArray(item.urls)
      ? item.urls.map((value) => String(value).trim()).filter(Boolean)
      : undefined;
    mapped.push({
      id: String(item.id ?? `${kind}-${index}`),
      kind,
      text: typeof item.text === 'string' ? item.text : undefined,
      url: typeof item.url === 'string' ? item.url.trim() : undefined,
      urls,
      caption: typeof item.caption === 'string' ? item.caption : undefined,
    });
  });
  return mapped;
}

export function blocksFromPost(post: {
  body: string;
  mediaUrl?: string;
  linkUrl?: string;
  blocks?: FeedContentBlock[];
}): FeedContentBlock[] {
  const stored = parseFeedBlocks(post.blocks ?? []);
  if (stored.length) return stored;
  const blocks: FeedContentBlock[] = [];
  if (post.body.trim()) {
    blocks.push({ id: newId(), kind: 'text', text: post.body });
  }
  const media = (post.mediaUrl ?? '').trim();
  if (media) {
    blocks.push({
      id: newId(),
      kind: isVideoUrl(media) ? 'video' : 'image',
      url: media,
    });
  }
  return blocks;
}

export function previewTextFromBlocks(blocks: FeedContentBlock[]) {
  return blocks
    .filter((block) => block.kind === 'text')
    .map((block) => (block.text ?? '').trim())
    .filter(Boolean)
    .join('\n\n');
}

export function mediaFromBlocks(blocks: FeedContentBlock[]) {
  const video = blocks.find((block) => block.kind === 'video' && block.url);
  if (video?.url) return video.url;
  const image = blocks.find((block) => block.kind === 'image' && block.url);
  if (image?.url) return image.url;
  const slides = blocks.find((block) => block.kind === 'slideshow' && (block.urls?.length || block.url));
  return slides?.urls?.[0] || slides?.url || '';
}

export function emptyTextBlock(): FeedContentBlock {
  return { id: newId(), kind: 'text', text: '' };
}
