import { useInfiniteQuery } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { colors, space, type } from '@comm-platform/ui';

import { fetchFeed } from '@/coding/api/feedApi';
import { FeedCard } from '@/coding/components/FeedCard';

export function HighlightsFeed() {
  const feed = useInfiniteQuery({
    queryKey: ['highlights-feed'],
    queryFn: ({ pageParam }) => fetchFeed(pageParam, 3),
    initialPageParam: 1,
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
          {feed.isLoading ? <ActivityIndicator color={colors.primary} /> : null}
        </View>
      }
      ListFooterComponent={feed.isFetchingNextPage ? <ActivityIndicator color={colors.primary} /> : null}
      ListEmptyComponent={
        feed.isLoading ? null : (
          <Text style={{ color: colors.textMuted }}>No published posts yet.</Text>
        )
      }
    />
  );
}
