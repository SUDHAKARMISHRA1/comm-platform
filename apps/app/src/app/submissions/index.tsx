import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

import { AppShell } from '@/components/app-shell';
import { fetchSubmissions } from '@/coding/api/submissionApi';
import { useAuth } from '@/providers/auth-provider';

export default function SubmissionsScreen() {
  const { session, loading: authLoading } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['submissions'],
    queryFn: fetchSubmissions,
    enabled: Boolean(session) && !authLoading,
  });

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.title}>Submissions</Text>
        {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
        {error ? <Text style={styles.error}>Failed to load submissions.</Text> : null}
        <View style={styles.table}>
          <View style={styles.head}>
            <Text style={[styles.th, styles.q]}>Question</Text>
            <Text style={[styles.th, styles.lang]}>Language</Text>
            <Text style={[styles.th, styles.status]}>Status</Text>
            <Text style={[styles.th, styles.time]}>Runtime</Text>
            <Text style={[styles.th, styles.date]}>Date</Text>
          </View>
          {data?.submissions.map((s) => (
            <Link key={s.id} href={`/submissions/${s.id}`} asChild>
              <Pressable style={styles.row}>
                <Text style={[styles.td, styles.q, styles.link]}>{s.questionTitle}</Text>
                <Text style={[styles.td, styles.lang]}>{s.language}</Text>
                <Text style={[styles.td, styles.status, s.status === 'ACCEPTED' ? styles.ok : styles.bad]}>{s.status}</Text>
                <Text style={[styles.td, styles.time]}>{s.executionTime}</Text>
                <Text style={[styles.td, styles.date]}>{new Date(s.createdAt).toLocaleDateString()}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.lg, gap: space.md, maxWidth: 1000, width: '100%', alignSelf: 'center' },
  title: { fontSize: type.title, fontWeight: '700', color: colors.text },
  error: { color: colors.danger },
  table: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, overflow: 'hidden' },
  head: { flexDirection: 'row', backgroundColor: colors.surfaceMuted, padding: space.sm },
  row: { flexDirection: 'row', padding: space.sm, borderTopWidth: 1, borderColor: colors.border },
  th: { fontSize: type.small, fontWeight: '700', color: colors.textMuted },
  td: { fontSize: type.small, color: colors.text },
  q: { flex: 2 },
  lang: { flex: 1 },
  status: { flex: 1 },
  time: { flex: 1 },
  date: { flex: 1 },
  link: { color: colors.primary, fontWeight: '600' },
  ok: { color: colors.success },
  bad: { color: colors.danger },
});
