/** Highlights feed HTTP + mock fallback. */
import {
  addMockFeedComment,
  GUEST_FEED_LIMIT,
  listMockFeed,
  listMockFeedComments,
  shareMockFeedPost,
  toggleMockFeedCommentLike,
  toggleMockFeedLike,
  type FeedCommentLikeResponse,
  type FeedCommentNode,
  type FeedLikeResponse,
  type FeedListResponse,
  type FeedShareResponse,
} from '@comm-platform/coding';

import { USE_MOCK_API, apiFetch, currentApiUserId } from './client';

export const FEED_PAGE_SIZE = 6;

export async function fetchFeed(page: number, pageSize = FEED_PAGE_SIZE, guest = false): Promise<FeedListResponse> {
  if (USE_MOCK_API) {
    const size = guest ? GUEST_FEED_LIMIT : pageSize;
    return listMockFeed(currentApiUserId(), guest ? 1 : page, size, guest ? { preferArticles: true } : undefined);
  }
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  return apiFetch(`/feed?${qs}`);
}

export async function likeFeedPost(postId: string): Promise<FeedLikeResponse> {
  if (USE_MOCK_API) return toggleMockFeedLike(currentApiUserId(), postId);
  return apiFetch(`/feed/${postId}/like`, { method: 'POST' });
}

export async function shareFeedPostApi(postId: string): Promise<FeedShareResponse> {
  if (USE_MOCK_API) return shareMockFeedPost(currentApiUserId(), postId);
  return apiFetch(`/feed/${postId}/share`, { method: 'POST' });
}

export async function fetchFeedComments(postId: string): Promise<FeedCommentNode[]> {
  if (USE_MOCK_API) return listMockFeedComments(currentApiUserId(), postId);
  const result = await apiFetch<{ comments: FeedCommentNode[] }>(`/feed/${postId}/comments`);
  return result.comments;
}

export async function addFeedCommentApi(
  postId: string,
  body: string,
  parentId?: string | null,
): Promise<FeedCommentNode[]> {
  if (USE_MOCK_API) {
    return addMockFeedComment(currentApiUserId(), postId, body, 'Member', parentId);
  }
  const result = await apiFetch<{ comments: FeedCommentNode[] }>(`/feed/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body, parentId }),
  });
  return result.comments;
}

export async function likeFeedComment(commentId: string): Promise<FeedCommentLikeResponse> {
  if (USE_MOCK_API) return toggleMockFeedCommentLike(currentApiUserId(), commentId);
  return apiFetch(`/feed/comments/${commentId}/like`, { method: 'POST' });
}
