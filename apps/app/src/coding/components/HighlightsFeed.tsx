import { useInfiniteQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { FlatList, Text, View } from 'react-native';

import { colors, space, type } from '@comm-platform/ui';

import { FEED_PAGE_SIZE, fetchFeed } from '@/coding/api/feedApi';
import { FeedCard } from '@/coding/components/FeedCard';
import { PageLoader } from '@/components/page-loader';
import { LIST_STALE_MS } from '@/lib/prefetch-signed-in';
import { useAuth } from '@/providers/auth-provider';

export function HighlightsFeed(_props?: { children?: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const feed = useInfiniteQuery({
    queryKey: ['highlights-feed'],
    queryFn: ({ pageParam }) => fetchFeed(pageParam, FEED_PAGE_SIZE),
    initialPageParam: 1,
    enabled: Boolean(session) && !authLoading,
    staleTime: LIST_STALE_MS,
    getNextPageParam: (last) =>
      last.pagination.page * last.pagination.pageSize < last.pagination.total ? last.pagination.page + 1 : undefined,
  });
  const posts = feed.data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedCard post={item} />}
      contentContainerStyle={{ padding: space.lg, gap: space.md, paddingBottom: space.xl }}
      onEndReached={() => {
        if (feed.hasNextPage && !feed.isFetchingNextPage) void feed.fetchNextPage();
      }}
      onEndReachedThreshold={0.4}
      ListHeaderComponent={
        <View style={{ gap: 6, marginBottom: 8 }}>
          <Text style={{ color: colors.primary, fontWeight: '800', letterSpacing: 1.2, fontSize: 11 }}>HIGHLIGHTS</Text>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700' }}>From the team</Text>
          <Text style={{ color: colors.textMuted, fontSize: type.body, lineHeight: 22 }}>
            Articles, posts, and videos published for your interview prep.
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
