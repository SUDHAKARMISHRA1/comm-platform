/** Highlights feed for students and admin. Dual-writes to Supabase and/or the JSON file-store. */
import { randomUUID } from 'node:crypto';

import type { FeedCommentRecord, FeedPostRecord } from '../schema';
import type {
  FeedCommentLikeResponse,
  FeedLikeResponse,
  FeedListResponse,
  FeedPostAdminRow,
  FeedPostKind,
  FeedShareResponse,
} from '../types';
import { nestComments, toFeedAdminRow, toFeedCard } from '../feed-helpers';
import { blocksFromPost, mediaFromBlocks, parseFeedBlocks, previewTextFromBlocks } from '../feed-content';
import { mutateStore, readStore } from './file-store';
import { isSupabasePersistenceEnabled } from './supabase-user-data';
import {
  deleteFeedCommentLike,
  deleteFeedLike,
  deleteHighlightPost,
  feedPostsReady,
  feedTablesReady,
  getHighlightPost,
  insertFeedComment,
  insertFeedCommentLike,
  insertFeedLike,
  insertFeedShare,
  listFeedCommentLikes,
  listFeedComments,
  listFeedLikes,
  listFeedShares,
  listHighlightPosts,
  updateFeedCommentHidden,
  upsertHighlightPost,
} from './supabase-feed';

const KINDS: FeedPostKind[] = ['article', 'post', 'video', 'link'];

function asKind(value: string): FeedPostKind {
  return KINDS.includes(value as FeedPostKind) ? (value as FeedPostKind) : 'post';
}

const FEED_TABLES_MISSING =
  'Highlight feed tables were not found in Supabase. Confirm highlight_post_likes exists, then restart the web server.';

const FEED_POSTS_MISSING =
  'Highlight posts table was not found in Supabase. Run supabase/migrations/0008_highlight_posts.sql, then restart the web server.';

async function requireFeedPostsReady() {
  if (!isSupabasePersistenceEnabled()) return false;
  if (!(await feedPostsReady())) throw new Error(FEED_POSTS_MISSING);
  return true;
}

async function loadPosts(): Promise<FeedPostRecord[]> {
  if (await requireFeedPostsReady()) {
    const posts = await listHighlightPosts();
    if (posts.length) return posts;
    const local = (await readStore()).feedPosts ?? [];
    if (!local.length) return [];
    for (const post of local) await upsertHighlightPost(post);
    return listHighlightPosts();
  }
  const data = await readStore();
  return [...(data.feedPosts ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function loadPost(id: string) {
  if (await requireFeedPostsReady()) {
    return getHighlightPost(id);
  }
  const data = await readStore();
  return (data.feedPosts ?? []).find((post) => post.id === id) ?? null;
}

async function engagement() {
  if (isSupabasePersistenceEnabled()) {
    if (!(await feedTablesReady())) throw new Error(FEED_TABLES_MISSING);
    const [likes, shares, comments, commentLikes] = await Promise.all([
      listFeedLikes(),
      listFeedShares(),
      listFeedComments(),
      listFeedCommentLikes(),
    ]);
    return { likes, shares, comments, commentLikes, persist: 'db' as const };
  }
  const data = await readStore();
  return {
    likes: data.feedLikes ?? [],
    shares: data.feedShares ?? [],
    comments: data.feedComments ?? [],
    commentLikes: data.feedCommentLikes ?? [],
    persist: 'file' as const,
  };
}

export async function listFeedPosts() {
  return loadPosts();
}

async function engagementOrEmpty() {
  try {
    return await engagement();
  } catch {
    return {
      likes: [],
      shares: [],
      comments: [],
      commentLikes: [],
      persist: 'file' as const,
    };
  }
}

export async function listFeedPostsWithStats(): Promise<FeedPostAdminRow[]> {
  const posts = await listFeedPosts();
  const { likes, shares, comments } = await engagementOrEmpty();
  return posts.map((post) => toFeedAdminRow(post, likes, shares, comments));
}

export async function getFeedPostAdmin(id: string) {
  const post = await loadPost(id);
  if (!post) return null;
  const { likes, shares, comments, commentLikes } = await engagementOrEmpty();
  return {
    post,
    stats: toFeedAdminRow(post, likes, shares, comments),
    comments: nestComments(id, 'admin', comments, commentLikes, { includeHidden: true }),
  };
}

export async function listPublishedFeed(userId: string, page = 1, pageSize = 5): Promise<FeedListResponse> {
  const { likes, shares, comments } = await engagement();
  const items = (await loadPosts())
    .filter((post) => post.published)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const safePage = Math.max(1, page);
  const size = Math.min(20, Math.max(1, pageSize));
  const total = items.length;
  const slice = items.slice((safePage - 1) * size, safePage * size);
  return {
    posts: slice.map((post) => toFeedCard(post, userId, likes, shares, comments)),
    pagination: { page: safePage, pageSize: size, total },
  };
}

export async function listPostComments(userId: string, postId: string) {
  const post = await loadPost(postId);
  if (!post?.published) throw new Error('Post not found');
  const { comments, commentLikes } = await engagement();
  return nestComments(postId, userId, comments, commentLikes);
}

export async function toggleFeedLike(userId: string, postId: string): Promise<FeedLikeResponse> {
  const post = await loadPost(postId);
  if (!post?.published) throw new Error('Post not found');
  const now = new Date().toISOString();
  const social = await engagement();
  const existing = social.likes.find((row) => row.userId === userId && row.postId === postId);
  if (isSupabasePersistenceEnabled()) {
    if (social.persist !== 'db') throw new Error(FEED_TABLES_MISSING);
    if (existing) await deleteFeedLike(userId, postId);
    else await insertFeedLike(userId, postId, now);
    const likes = await listFeedLikes();
    return {
      postId,
      likeCount: likes.filter((row) => row.postId === postId).length,
      likedByMe: !existing,
    };
  }
  return mutateStore((store) => {
    store.feedLikes ??= [];
    const idx = store.feedLikes.findIndex((row) => row.userId === userId && row.postId === postId);
    if (idx >= 0) store.feedLikes.splice(idx, 1);
    else store.feedLikes.push({ userId, postId, createdAt: now });
    return {
      postId,
      likeCount: store.feedLikes.filter((row) => row.postId === postId).length,
      likedByMe: idx < 0,
    };
  });
}

export async function shareFeedPost(userId: string, postId: string): Promise<FeedShareResponse> {
  const post = await loadPost(postId);
  if (!post?.published) throw new Error('Post not found');
  const now = new Date().toISOString();
  const social = await engagement();
  const already = social.shares.some((row) => row.userId === userId && row.postId === postId);
  if (isSupabasePersistenceEnabled()) {
    if (social.persist !== 'db') throw new Error(FEED_TABLES_MISSING);
    if (!already) await insertFeedShare(userId, postId, now);
    const shares = await listFeedShares();
    return {
      postId,
      shareCount: shares.filter((row) => row.postId === postId).length,
      sharedByMe: true,
    };
  }
  return mutateStore((store) => {
    store.feedShares ??= [];
    if (!store.feedShares.some((row) => row.userId === userId && row.postId === postId)) {
      store.feedShares.push({ userId, postId, createdAt: now });
    }
    return {
      postId,
      shareCount: store.feedShares.filter((row) => row.postId === postId).length,
      sharedByMe: true,
    };
  });
}

export async function addFeedComment(
  userId: string,
  postId: string,
  body: string,
  authorName: string,
  parentId?: string | null,
) {
  const text = body.trim();
  if (!text) throw new Error('Comment cannot be empty');
  if (text.length > 2000) throw new Error('Comment is too long');
  const post = await loadPost(postId);
  if (!post?.published) throw new Error('Post not found');
  const social = await engagement();
  let rootParent: string | null = parentId || null;
  if (rootParent) {
    const parent = social.comments.find((row) => row.id === rootParent && row.postId === postId);
    if (!parent) throw new Error('Comment not found');
    rootParent = parent.parentId ?? parent.id;
  }
  const row: FeedCommentRecord = {
    id: `cmt-${randomUUID()}`,
    postId,
    parentId: rootParent,
    userId,
    authorName: authorName.trim() || 'Member',
    body: text,
    createdAt: new Date().toISOString(),
  };
  if (isSupabasePersistenceEnabled()) {
    if (social.persist !== 'db') throw new Error(FEED_TABLES_MISSING);
    await insertFeedComment(row);
    const comments = await listFeedComments();
    const likes = await listFeedCommentLikes();
    return nestComments(postId, userId, comments, likes);
  }
  return mutateStore((store) => {
    store.feedComments ??= [];
    store.feedComments.push(row);
    return nestComments(postId, userId, store.feedComments, store.feedCommentLikes ?? []);
  });
}

export async function toggleFeedCommentLike(userId: string, commentId: string): Promise<FeedCommentLikeResponse> {
  const social = await engagement();
  const comment = social.comments.find((row) => row.id === commentId);
  if (!comment) throw new Error('Comment not found');
  const now = new Date().toISOString();
  const existing = social.commentLikes.find((row) => row.userId === userId && row.commentId === commentId);
  if (isSupabasePersistenceEnabled()) {
    if (social.persist !== 'db') throw new Error(FEED_TABLES_MISSING);
    if (existing) await deleteFeedCommentLike(userId, commentId);
    else await insertFeedCommentLike(userId, commentId, now);
    const likes = await listFeedCommentLikes();
    return {
      commentId,
      likeCount: likes.filter((row) => row.commentId === commentId).length,
      likedByMe: !existing,
    };
  }
  return mutateStore((store) => {
    store.feedCommentLikes ??= [];
    const idx = store.feedCommentLikes.findIndex((row) => row.userId === userId && row.commentId === commentId);
    if (idx >= 0) store.feedCommentLikes.splice(idx, 1);
    else store.feedCommentLikes.push({ userId, commentId, createdAt: now });
    return {
      commentId,
      likeCount: store.feedCommentLikes.filter((row) => row.commentId === commentId).length,
      likedByMe: idx < 0,
    };
  });
}

export async function saveFeedPost(input: {
  id?: string;
  kind: string;
  title: string;
  body: string;
  mediaUrl?: string;
  linkUrl?: string;
  authorName?: string;
  published: boolean;
  blocks?: unknown;
}) {
  const title = input.title.trim();
  if (!title) throw new Error('Title is required');
  const parsed = parseFeedBlocks(input.blocks);
  const blocks = parsed.length
    ? parsed
    : blocksFromPost({
        body: input.body,
        mediaUrl: input.mediaUrl,
        linkUrl: input.linkUrl,
      });
  const body = previewTextFromBlocks(blocks) || input.body;
  const mediaUrl = mediaFromBlocks(blocks) || (input.mediaUrl ?? '').trim();
  const now = new Date().toISOString();
  const row: FeedPostRecord = {
    id: input.id?.trim() || `feed-${Date.now()}`,
    kind: asKind(input.kind),
    title,
    body,
    mediaUrl,
    linkUrl: (input.linkUrl ?? '').trim(),
    authorName: (input.authorName ?? '').trim() || 'Comm Platform',
    published: input.published,
    blocks,
    createdAt: now,
    updatedAt: now,
  };
  if (await requireFeedPostsReady()) {
    if (input.id) {
      const existing = await getHighlightPost(input.id);
      if (!existing) throw new Error('Post not found');
      row.createdAt = existing.createdAt;
    }
    return upsertHighlightPost(row);
  }
  return mutateStore((data) => {
    data.feedPosts ??= [];
    if (input.id) {
      const current = data.feedPosts.find((post) => post.id === input.id);
      if (!current) throw new Error('Post not found');
      current.kind = row.kind;
      current.title = row.title;
      current.body = row.body;
      current.mediaUrl = row.mediaUrl;
      current.linkUrl = row.linkUrl;
      current.authorName = row.authorName;
      current.published = row.published;
      current.blocks = row.blocks;
      current.updatedAt = now;
      return current;
    }
    data.feedPosts.push(row);
    return row;
  });
}

export async function setFeedCommentHidden(commentId: string, hidden: boolean) {
  if (isSupabasePersistenceEnabled()) {
    const social = await engagementOrEmpty();
    if (social.persist !== 'db') throw new Error(FEED_TABLES_MISSING);
    await updateFeedCommentHidden(commentId, hidden);
    return true;
  }
  return mutateStore((data) => {
    data.feedComments ??= [];
    const row = data.feedComments.find((comment) => comment.id === commentId);
    if (!row) throw new Error('Comment not found');
    row.hidden = hidden;
    return true;
  });
}

export async function deleteFeedPost(id: string) {
  if (await requireFeedPostsReady()) {
    await deleteHighlightPost(id);
    return true;
  }
  return mutateStore((data) => {
    data.feedPosts = (data.feedPosts ?? []).filter((post) => post.id !== id);
    data.feedLikes = (data.feedLikes ?? []).filter((row) => row.postId !== id);
    data.feedShares = (data.feedShares ?? []).filter((row) => row.postId !== id);
    const commentIds = new Set((data.feedComments ?? []).filter((row) => row.postId === id).map((row) => row.id));
    data.feedComments = (data.feedComments ?? []).filter((row) => row.postId !== id);
    data.feedCommentLikes = (data.feedCommentLikes ?? []).filter((row) => !commentIds.has(row.commentId));
    return true;
  });
}
