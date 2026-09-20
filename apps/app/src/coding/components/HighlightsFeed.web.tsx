import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, type ReactNode } from 'react';

import { FEED_PAGE_SIZE, fetchFeed } from '@/coding/api/feedApi';
import { FeedCard } from '@/coding/components/FeedCard';
import { PageLoader } from '@/components/page-loader';
import { LIST_STALE_MS } from '@/lib/prefetch-signed-in';
import { useAuth } from '@/providers/auth-provider';

export function HighlightsFeed({ children }: { children?: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const sentinel = useRef<HTMLDivElement | null>(null);
  const feed = useInfiniteQuery({
    queryKey: ['highlights-feed'],
    queryFn: ({ pageParam }) => fetchFeed(pageParam, FEED_PAGE_SIZE),
    initialPageParam: 1,
    enabled: Boolean(session) && !authLoading,
    staleTime: LIST_STALE_MS,
    getNextPageParam: (last) =>
      last.pagination.page * last.pagination.pageSize < last.pagination.total ? last.pagination.page + 1 : undefined,
  });

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && feed.hasNextPage && !feed.isFetchingNextPage) {
        void feed.fetchNextPage();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [feed.hasNextPage, feed.isFetchingNextPage, feed.fetchNextPage]);

  const posts = feed.data?.pages.flatMap((page) => page.posts) ?? [];
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <section className="hl-featured">
        <div className="hl-feed-head">
          <p className="hl-label">Latest from the team</p>
          <h2>Published for you</h2>
        </div>
        {feed.isLoading ? <PageLoader message="Lining up today’s highlights…" /> : null}
        {feed.isError ? (
          <p className="hl-muted">Could not load the latest article. Sign in and confirm the API is running.</p>
        ) : null}
        {featured ? <FeedCard post={featured} /> : null}
        {!feed.isLoading && !featured ? (
          <p className="hl-muted">No published posts yet. Admins can add them from Highlights feed in the admin panel.</p>
        ) : null}
      </section>

      {children}

      {rest.length > 0 || feed.isFetchingNextPage ? (
        <section className="hl-feed">
          <div className="hl-feed-head">
            <p className="hl-label">From the team</p>
            <h2>More articles</h2>
          </div>
          {rest.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
          {feed.isFetchingNextPage ? <PageLoader compact message="Loading more highlights…" /> : null}
        </section>
      ) : null}
      <div ref={sentinel} className="hl-feed-sentinel" />
    </>
  );
}
