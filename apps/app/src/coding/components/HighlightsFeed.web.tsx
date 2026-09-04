import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, type ReactNode } from 'react';

import { fetchFeed } from '@/coding/api/feedApi';
import { FeedCard } from '@/coding/components/FeedCard';

export function HighlightsFeed({ children }: { children?: ReactNode }) {
  const sentinel = useRef<HTMLDivElement | null>(null);
  const feed = useInfiniteQuery({
    queryKey: ['highlights-feed'],
    queryFn: ({ pageParam }) => fetchFeed(pageParam, 3),
    initialPageParam: 1,
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
        {feed.isLoading ? <p className="hl-muted">Loading the latest article…</p> : null}
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
          {feed.isFetchingNextPage ? <p className="hl-muted">Loading more…</p> : null}
        </section>
      ) : null}
      <div ref={sentinel} className="hl-feed-sentinel" />
    </>
  );
}
