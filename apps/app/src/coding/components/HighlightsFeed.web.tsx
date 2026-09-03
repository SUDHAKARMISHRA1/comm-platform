import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { fetchFeed } from '@/coding/api/feedApi';
import { FeedCard } from '@/coding/components/FeedCard';

export function HighlightsFeed() {
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

  return (
    <section className="hl-feed">
      <div className="hl-feed-head">
        <p className="hl-label">From the team</p>
        <h2>Articles, posts, and videos</h2>
        <p className="hl-copy">
          Published by admins. Like what you found useful, share a link with your study group, and leave a comment if
          you saw this in a loop.
        </p>
      </div>
      {feed.isLoading ? <p className="hl-muted">Loading the feed…</p> : null}
      {feed.isError ? <p className="hl-muted">Could not load the feed. Sign in and confirm the API is running.</p> : null}
      {posts.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}
      <div ref={sentinel} />
      {feed.isFetchingNextPage ? <p className="hl-muted">Loading more…</p> : null}
      {!feed.isLoading && posts.length === 0 ? (
        <p className="hl-muted">No published posts yet. Admins can add them from Highlights feed in the admin panel.</p>
      ) : null}
    </section>
  );
}
