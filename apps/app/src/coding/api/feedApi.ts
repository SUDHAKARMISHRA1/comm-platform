/** Highlights feed HTTP + mock fallback. */
import {
  addMockFeedComment,
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

export async function fetchFeed(page: number, pageSize = 3): Promise<FeedListResponse> {
  if (USE_MOCK_API) return listMockFeed(currentApiUserId(), page, pageSize);
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
