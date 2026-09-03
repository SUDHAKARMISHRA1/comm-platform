import { defaultFeedPosts } from '../store/seed';
import type {
  FeedCommentLikeRecord,
  FeedCommentRecord,
  FeedLikeRecord,
  FeedShareRecord,
} from '../schema';
import type { FeedCommentLikeResponse, FeedLikeResponse, FeedListResponse, FeedShareResponse } from '../types';
import { nestComments, toFeedCard } from '../feed-helpers';

const posts = defaultFeedPosts();
const likes: FeedLikeRecord[] = [];
const shares: FeedShareRecord[] = [];
const comments: FeedCommentRecord[] = [];
const commentLikes: FeedCommentLikeRecord[] = [];

export function listMockFeed(userId: string, page = 1, pageSize = 5): FeedListResponse {
  const published = posts.filter((post) => post.published).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const size = Math.min(20, Math.max(1, pageSize));
  const safePage = Math.max(1, page);
  const slice = published.slice((safePage - 1) * size, safePage * size);
  return {
    posts: slice.map((post) => toFeedCard(post, userId, likes, shares, comments)),
    pagination: { page: safePage, pageSize: size, total: published.length },
  };
}

export function toggleMockFeedLike(userId: string, postId: string): FeedLikeResponse {
  const idx = likes.findIndex((row) => row.userId === userId && row.postId === postId);
  if (idx >= 0) likes.splice(idx, 1);
  else likes.push({ userId, postId, createdAt: new Date().toISOString() });
  return {
    postId,
    likeCount: likes.filter((row) => row.postId === postId).length,
    likedByMe: idx < 0,
  };
}

export function shareMockFeedPost(userId: string, postId: string): FeedShareResponse {
  if (!shares.some((row) => row.userId === userId && row.postId === postId)) {
    shares.push({ userId, postId, createdAt: new Date().toISOString() });
  }
  return {
    postId,
    shareCount: shares.filter((row) => row.postId === postId).length,
    sharedByMe: true,
  };
}

export function listMockFeedComments(userId: string, postId: string) {
  return nestComments(postId, userId, comments, commentLikes);
}

export function addMockFeedComment(userId: string, postId: string, body: string, authorName: string, parentId?: string | null) {
  const text = body.trim();
  if (!text) throw new Error('Comment cannot be empty');
  let root: string | null = parentId || null;
  if (root) {
    const parent = comments.find((row) => row.id === root);
    root = parent?.parentId ?? parent?.id ?? null;
  }
  comments.push({
    id: `cmt-mock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    postId,
    parentId: root,
    userId,
    authorName: authorName || 'Member',
    body: text,
    createdAt: new Date().toISOString(),
  });
  return nestComments(postId, userId, comments, commentLikes);
}

export function toggleMockFeedCommentLike(userId: string, commentId: string): FeedCommentLikeResponse {
  const idx = commentLikes.findIndex((row) => row.userId === userId && row.commentId === commentId);
  if (idx >= 0) commentLikes.splice(idx, 1);
  else commentLikes.push({ userId, commentId, createdAt: new Date().toISOString() });
  return {
    commentId,
    likeCount: commentLikes.filter((row) => row.commentId === commentId).length,
    likedByMe: idx < 0,
  };
}
