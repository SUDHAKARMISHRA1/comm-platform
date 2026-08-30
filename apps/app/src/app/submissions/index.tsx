import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

import { fetchSubmissions } from '@/coding/api/submissionApi';
import { AppShell } from '@/components/app-shell';
import { submissionTone } from '@/coding/statusColors';
import { useAuth } from '@/providers/auth-provider';

export default function SubmissionsListScreen() {
  const { session, loading: authLoading } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['submissions'],
    queryFn: fetchSubmissions,
    enabled: Boolean(session) && !authLoading,
  });
  const submissions = data?.submissions ?? [];

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.kicker}>History</Text>
        <Text style={styles.title}>All submissions</Text>
        <Text style={styles.hint}>Open any row to view the submitted source.</Text>
        {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
        {error ? <Text style={styles.error}>Could not load submissions.</Text> : null}
        {submissions.length === 0 && !isLoading ? (
          <Text style={styles.hint}>No submissions yet. Submit from a practice problem.</Text>
        ) : null}
        {submissions.map((s) => (
          <Pressable key={s.id} style={styles.row} onPress={() => router.push(`/submissions/${s.id}`)}>
            <View style={styles.grow}>
              <Text style={styles.rowTitle}>{s.questionTitle}</Text>
              <Text style={styles.meta}>
                {s.language} ·{' '}
                <Text
                  style={
                    submissionTone(s.status) === 'ok'
                      ? styles.ok
                      : submissionTone(s.status) === 'pending'
                        ? styles.pending
                        : styles.fail
                  }
                >
                  {s.status.replace(/_/g, ' ')}
                </Text>
                {' · '}
                {s.executionTime}
              </Text>
            </View>
            <Text style={styles.meta}>{new Date(s.createdAt).toLocaleString()}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.lg, gap: space.sm, maxWidth: 800, width: '100%', alignSelf: 'center' },
  kicker: { color: colors.primary, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', fontSize: 11 },
  title: { color: colors.text, fontSize: type.title, fontWeight: '700' },
  hint: { color: colors.textMuted, fontSize: type.small, marginBottom: space.sm },
  error: { color: colors.danger },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: space.md,
  },
  grow: { flex: 1, gap: 4 },
  rowTitle: { color: colors.text, fontWeight: '700' },
  meta: { color: colors.textMuted, fontSize: type.small },
  ok: { color: colors.success, fontWeight: '700' },
  pending: { color: colors.warning, fontWeight: '700' },
  fail: { color: colors.danger, fontWeight: '700' },
});
