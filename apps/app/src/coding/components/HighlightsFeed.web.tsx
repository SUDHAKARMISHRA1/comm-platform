import { useInfiniteQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, type ReactNode } from 'react';

import { GUEST_FEED_LIMIT } from '@comm-platform/coding';

import { FEED_PAGE_SIZE, fetchFeed } from '@/coding/api/feedApi';
import { FeedCard } from '@/coding/components/FeedCard';
import { GuestFeedProvider } from '@/components/guest-highlights-gate';
import { PageLoader } from '@/components/page-loader';
import { highlightsPath, rememberGuestPost, safePostId, useGuestFeed } from '@/lib/guest-highlights';
import { LIST_STALE_MS } from '@/lib/prefetch-signed-in';
import { loginHref, signupHref } from '@/lib/site-links';
import { spaNavigate } from '@/lib/spa-nav';
import { useAuth } from '@/providers/auth-provider';

function GuestPostSentinel({
  postId,
  index,
  children,
}: {
  postId: string;
  index: number;
  children: ReactNode;
}) {
  const { signedIn, noteVisiblePost } = useGuestFeed();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (signedIn) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          const scroller = document.querySelector('.cp-shell-main');
          const scrolled = (scroller instanceof HTMLElement ? scroller.scrollTop : window.scrollY) > 80;
          noteVisiblePost(postId, index, scrolled);
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [index, noteVisiblePost, postId, signedIn]);

  return <div ref={ref}>{children}</div>;
}

export function HighlightsFeed({ children }: { children?: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const signedIn = Boolean(session);
  const params = useLocalSearchParams<{ post?: string }>();
  const sentinel = useRef<HTMLDivElement | null>(null);
  const pageSize = signedIn ? FEED_PAGE_SIZE : GUEST_FEED_LIMIT;
  const feed = useInfiniteQuery({
    queryKey: ['highlights-feed', signedIn ? 'in' : 'out'],
    queryFn: ({ pageParam }) => fetchFeed(pageParam, pageSize, !signedIn),
    initialPageParam: 1,
    enabled: !authLoading,
    staleTime: LIST_STALE_MS,
    getNextPageParam: (last) =>
      signedIn && last.pagination.page * last.pagination.pageSize < last.pagination.total
        ? last.pagination.page + 1
        : undefined,
  });

  const posts = feed.data?.pages.flatMap((page) => page.posts) ?? [];
  const featured = posts[0];
  const rest = posts.slice(1);
  const targetId =
    safePostId(params.post) ??
    (typeof window !== 'undefined' ? safePostId(window.location.hash.replace('#', '')) : null);
  const remaining = Math.max(0, (feed.data?.pages[0]?.pagination.total ?? 0) - posts.length);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !signedIn) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && feed.hasNextPage && !feed.isFetchingNextPage) {
        void feed.fetchNextPage();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [feed.hasNextPage, feed.isFetchingNextPage, feed.fetchNextPage, signedIn]);

  useEffect(() => {
    if (!targetId || !posts.length) return;
    if (posts.some((post) => post.id === targetId)) {
      rememberGuestPost(targetId);
      const node = document.getElementById(`post-${targetId}`);
      if (!node) return;
      const timer = window.setTimeout(() => node.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      return () => window.clearTimeout(timer);
    }
    if (signedIn && feed.hasNextPage && !feed.isFetchingNextPage) void feed.fetchNextPage();
    return undefined;
  }, [feed.hasNextPage, feed.isFetchingNextPage, posts, signedIn, targetId]);

  return (
    <GuestFeedProvider signedIn={signedIn}>
      <section className="hl-featured">
        <div className="hl-feed-head">
          <p className="hl-label">{signedIn ? 'Latest from the team' : 'Free preview'}</p>
          <h2>{signedIn ? 'Published for you' : 'A few articles, no account needed'}</h2>
          {!signedIn ? (
            <p className="hl-muted">
              Read {GUEST_FEED_LIMIT} published pieces. Sign in when you’re ready for the full feed — we’ll put you
              back on the article you were reading.
            </p>
          ) : null}
        </div>
        {feed.isLoading ? <PageLoader message="Lining up today’s highlights…" /> : null}
        {feed.isError ? (
          <p className="hl-muted">Could not load the latest article. Confirm the API is running.</p>
        ) : null}
        {featured ? (
          <GuestPostSentinel postId={featured.id} index={0}>
            <FeedCard post={featured} />
          </GuestPostSentinel>
        ) : null}
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
          {rest.map((post, index) => (
            <GuestPostSentinel key={post.id} postId={post.id} index={index + 1}>
              <FeedCard post={post} />
            </GuestPostSentinel>
          ))}
          {feed.isFetchingNextPage ? <PageLoader compact message="Loading more highlights…" /> : null}
        </section>
      ) : null}

      {!signedIn && remaining > 0 ? (
        <aside className="hl-guest-more">
          <p className="hl-guest-more-kicker">Members only from here</p>
          <h2>{remaining} more article{remaining === 1 ? '' : 's'} in Highlights</h2>
          <p>Likes, comments, and the rest of the feed unlock after you create an account.</p>
          <div className="hl-guest-more-actions">
            <a href={signupHref(highlightsPath(posts[posts.length - 1]?.id))} onClick={(e) => spaNavigate(signupHref(highlightsPath(posts[posts.length - 1]?.id)), e)}>
              Create a free account
            </a>
            <a href={loginHref(highlightsPath(posts[posts.length - 1]?.id))} onClick={(e) => spaNavigate(loginHref(highlightsPath(posts[posts.length - 1]?.id)), e)}>
              Sign in
            </a>
          </div>
        </aside>
      ) : null}
      <div ref={sentinel} className="hl-feed-sentinel" />
    </GuestFeedProvider>
  );
}
