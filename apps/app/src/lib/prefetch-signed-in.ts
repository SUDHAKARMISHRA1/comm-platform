/** Warm React Query caches as soon as a session exists so Highlights/Practice/Dashboard skip a blank wait. */
import type { FeedListResponse } from '@comm-platform/coding';
import type { QueryClient } from '@tanstack/react-query';

import { FEED_PAGE_SIZE, fetchFeed } from '@/coding/api/feedApi';
import { fetchCatalog, fetchDashboard, fetchQuestions } from '@/coding/api/questionApi';
import { fetchSubmissions } from '@/coding/api/submissionApi';

export const DASHBOARD_STALE_MS = 60_000;
export const CATALOG_STALE_MS = 5 * 60_000;
export const LIST_STALE_MS = 60_000;

let lastPrefetchUser: string | null = null;

export function prefetchSignedInData(queryClient: QueryClient, userId: string) {
  if (!userId || lastPrefetchUser === userId) return;
  lastPrefetchUser = userId;

  void queryClient.prefetchQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    staleTime: DASHBOARD_STALE_MS,
  });
  void queryClient.prefetchQuery({
    queryKey: ['catalog'],
    queryFn: fetchCatalog,
    staleTime: CATALOG_STALE_MS,
  });
  void queryClient.prefetchQuery({
    queryKey: ['submissions'],
    queryFn: fetchSubmissions,
    staleTime: LIST_STALE_MS,
  });
  void queryClient.prefetchQuery({
    queryKey: ['questions', 'practice-all'],
    queryFn: () => fetchQuestions({ page: 1, pageSize: 200, status: 'ALL' }),
    staleTime: LIST_STALE_MS,
  });
  void queryClient.prefetchInfiniteQuery({
    queryKey: ['highlights-feed', 'in'],
    queryFn: ({ pageParam }) => fetchFeed(Number(pageParam) || 1, FEED_PAGE_SIZE),
    initialPageParam: 1,
    staleTime: LIST_STALE_MS,
    getNextPageParam: (last: FeedListResponse) =>
      last.pagination.page * last.pagination.pageSize < last.pagination.total ? last.pagination.page + 1 : undefined,
  });
}

export function resetSignedInPrefetch() {
  lastPrefetchUser = null;
}
