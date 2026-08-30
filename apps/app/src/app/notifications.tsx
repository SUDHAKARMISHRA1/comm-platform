import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { colors, radius, space, type } from '@comm-platform/ui';

import { fetchSubmissions } from '@/coding/api/submissionApi';
import { AppShell } from '@/components/app-shell';
import { buildNotificationFeed } from '@/lib/notifications';
import { useAuth } from '@/providers/auth-provider';

export default function NotificationsScreen() {
  const { session, loading } = useAuth();
  const subs = useQuery({
    queryKey: ['submissions'],
    queryFn: fetchSubmissions,
    enabled: Boolean(session) && !loading,
  });
  const items = useMemo(
    () => buildNotificationFeed(subs.data?.submissions ?? []),
    [subs.data?.submissions],
  );

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.kicker}>Inbox</Text>
        <Text style={styles.title}>Notifications</Text>
        {subs.isLoading ? <Text style={styles.muted}>Loading…</Text> : null}
        {items.map((n) => (
          <Pressable
            key={n.id}
            style={styles.card}
            onPress={() => {
              if (n.href) router.push(n.href as never);
            }}
          >
            <Text style={styles.itemTitle}>{n.title}</Text>
            <Text style={styles.body}>{n.body}</Text>
            <Text style={styles.meta}>{new Date(n.createdAt).toLocaleString()}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.lg, gap: space.sm, maxWidth: 720, width: '100%', alignSelf: 'center' },
  kicker: { color: colors.primary, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', fontSize: 11 },
  title: { color: colors.text, fontSize: type.title, fontWeight: '700', marginBottom: space.sm },
  muted: { color: colors.textMuted },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: space.md,
    gap: 4,
  },
  itemTitle: { color: colors.text, fontWeight: '700' },
  body: { color: colors.textMuted, fontSize: type.small },
  meta: { color: colors.textMuted, fontSize: 11 },
});
