import { useInfiniteQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { FlatList, Text, View, type ViewToken } from 'react-native';

import { colors, space, type } from '@comm-platform/ui';
import { GUEST_FEED_LIMIT } from '@comm-platform/coding';

import { FEED_PAGE_SIZE, fetchFeed } from '@/coding/api/feedApi';
import { FeedCard } from '@/coding/components/FeedCard';
import { GuestFeedProvider } from '@/components/guest-highlights-gate';
import { PageLoader } from '@/components/page-loader';
import { rememberGuestPost, safePostId, useGuestFeed } from '@/lib/guest-highlights';
import { LIST_STALE_MS } from '@/lib/prefetch-signed-in';
import { useAuth } from '@/providers/auth-provider';

function HighlightsFeedList({ signedIn }: { signedIn: boolean }) {
  const { noteVisiblePost } = useGuestFeed();
  const params = useLocalSearchParams<{ post?: string }>();
  const listRef = useRef<FlatList>(null);
  const scrolled = useRef(false);
  const noteVisiblePostRef = useRef(noteVisiblePost);
  noteVisiblePostRef.current = noteVisiblePost;
  const signedInRef = useRef(signedIn);
  signedInRef.current = signedIn;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 45 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (signedInRef.current) return;
    for (const viewable of viewableItems) {
      if (typeof viewable.index === 'number' && viewable.item?.id) {
        noteVisiblePostRef.current(viewable.item.id, viewable.index, scrolled.current);
      }
    }
  }).current;
  const pageSize = signedIn ? FEED_PAGE_SIZE : GUEST_FEED_LIMIT;
  const feed = useInfiniteQuery({
    queryKey: ['highlights-feed', signedIn ? 'in' : 'out'],
    queryFn: ({ pageParam }) => fetchFeed(pageParam, pageSize, !signedIn),
    initialPageParam: 1,
    enabled: true,
    staleTime: LIST_STALE_MS,
    getNextPageParam: (last) =>
      signedIn && last.pagination.page * last.pagination.pageSize < last.pagination.total
        ? last.pagination.page + 1
        : undefined,
  });
  const posts = feed.data?.pages.flatMap((page) => page.posts) ?? [];
  const targetId = safePostId(params.post);

  useEffect(() => {
    if (!targetId || !posts.length) return;
    const index = posts.findIndex((post) => post.id === targetId);
    if (index < 0) {
      if (signedIn && feed.hasNextPage && !feed.isFetchingNextPage) void feed.fetchNextPage();
      return;
    }
    rememberGuestPost(targetId);
    listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.1 });
  }, [feed.hasNextPage, feed.isFetchingNextPage, posts, signedIn, targetId]);

  return (
    <FlatList
      ref={listRef}
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View nativeID={`post-${item.id}`}>
          <FeedCard post={item} />
        </View>
      )}
      contentContainerStyle={{ padding: space.lg, gap: space.md, paddingBottom: space.xl }}
      onScroll={(event) => {
        if (event.nativeEvent.contentOffset.y > 80) scrolled.current = true;
      }}
      scrollEventThrottle={16}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      onEndReached={() => {
        if (signedIn && feed.hasNextPage && !feed.isFetchingNextPage) void feed.fetchNextPage();
      }}
      onEndReachedThreshold={0.4}
      onScrollToIndexFailed={(info) => {
        setTimeout(() => listRef.current?.scrollToIndex({ index: info.index, animated: true }), 200);
      }}
      ListHeaderComponent={
        <View style={{ gap: 6, marginBottom: 8 }}>
          <Text style={{ color: colors.primary, fontWeight: '800', letterSpacing: 1.2, fontSize: 11 }}>HIGHLIGHTS</Text>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>
            {signedIn ? 'From the team' : 'A few articles, free'}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: type.body, lineHeight: 22 }}>
            {signedIn
              ? 'Articles, posts, and videos published for your interview prep.'
              : `Sample ${GUEST_FEED_LIMIT} published pieces. Sign in for the full feed — we’ll return you to this article.`}
          </Text>
          {feed.isLoading ? <PageLoader message="Lining up today’s highlights…" /> : null}
        </View>
      }
      ListFooterComponent={feed.isFetchingNextPage ? <PageLoader compact message="Loading more highlights…" /> : null}
      ListEmptyComponent={
        feed.isLoading ? null : (
          <Text style={{ color: colors.textMuted }}>No published posts yet.</Text>
        )
      }
    />
  );
}

export function HighlightsFeed(_props?: { children?: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const signedIn = Boolean(session);
  if (authLoading) return <PageLoader message="Lining up today’s highlights…" />;
  return (
    <GuestFeedProvider signedIn={signedIn}>
      <HighlightsFeedList signedIn={signedIn} />
    </GuestFeedProvider>
  );
}
