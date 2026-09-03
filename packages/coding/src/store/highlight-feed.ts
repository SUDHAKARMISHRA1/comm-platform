import { randomUUID } from 'node:crypto';

import type { FeedCommentRecord, FeedPostRecord } from '../schema';
import type {
  FeedCommentLikeResponse,
  FeedLikeResponse,
  FeedListResponse,
  FeedPostKind,
  FeedShareResponse,
} from '../types';
import { nestComments, toFeedCard } from '../feed-helpers';
import { mutateStore, readStore } from './file-store';
import { isSupabasePersistenceEnabled } from './supabase-user-data';
import {
  deleteFeedCommentLike,
  deleteFeedLike,
  feedTablesReady,
  insertFeedComment,
  insertFeedCommentLike,
  insertFeedLike,
  insertFeedShare,
  listFeedCommentLikes,
  listFeedComments,
  listFeedLikes,
  listFeedShares,
} from './supabase-feed';

const KINDS: FeedPostKind[] = ['article', 'post', 'video', 'link'];

function asKind(value: string): FeedPostKind {
  return KINDS.includes(value as FeedPostKind) ? (value as FeedPostKind) : 'post';
}

const FEED_TABLES_MISSING =
  'Highlight feed tables were not found in Supabase. Confirm highlight_post_likes exists, then restart the web server.';

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
  const data = await readStore();
  return [...(data.feedPosts ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listPublishedFeed(userId: string, page = 1, pageSize = 5): Promise<FeedListResponse> {
  const data = await readStore();
  const { likes, shares, comments } = await engagement();
  const items = (data.feedPosts ?? [])
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
  const data = await readStore();
  const post = (data.feedPosts ?? []).find((row) => row.id === postId && row.published);
  if (!post) throw new Error('Post not found');
  const { comments, commentLikes } = await engagement();
  return nestComments(postId, userId, comments, commentLikes);
}

export async function toggleFeedLike(userId: string, postId: string): Promise<FeedLikeResponse> {
  const data = await readStore();
  if (!(data.feedPosts ?? []).some((post) => post.id === postId && post.published)) {
    throw new Error('Post not found');
  }
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
  const data = await readStore();
  if (!(data.feedPosts ?? []).some((post) => post.id === postId && post.published)) {
    throw new Error('Post not found');
  }
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
  const data = await readStore();
  if (!(data.feedPosts ?? []).some((post) => post.id === postId && post.published)) {
    throw new Error('Post not found');
  }
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
}) {
  const title = input.title.trim();
  if (!title) throw new Error('Title is required');
  return mutateStore((data) => {
    const now = new Date().toISOString();
    data.feedPosts ??= [];
    if (input.id) {
      const row = data.feedPosts.find((post) => post.id === input.id);
      if (!row) throw new Error('Post not found');
      row.kind = asKind(input.kind);
      row.title = title;
      row.body = input.body;
      row.mediaUrl = (input.mediaUrl ?? '').trim();
      row.linkUrl = (input.linkUrl ?? '').trim();
      row.authorName = (input.authorName ?? '').trim() || 'Comm Platform';
      row.published = input.published;
      row.updatedAt = now;
      return row;
    }
    const row: FeedPostRecord = {
      id: `feed-${Date.now()}`,
      kind: asKind(input.kind),
      title,
      body: input.body,
      mediaUrl: (input.mediaUrl ?? '').trim(),
      linkUrl: (input.linkUrl ?? '').trim(),
      authorName: (input.authorName ?? '').trim() || 'Comm Platform',
      published: input.published,
      createdAt: now,
      updatedAt: now,
    };
    data.feedPosts.push(row);
    return row;
  });
}

export async function deleteFeedPost(id: string) {
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
