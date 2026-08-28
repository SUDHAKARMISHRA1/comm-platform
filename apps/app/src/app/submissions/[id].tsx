import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

import { AppShell } from '@/components/app-shell';
import { fetchSubmission } from '@/coding/api/submissionApi';

export default function SubmissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ['submission', id],
    queryFn: () => fetchSubmission(id!),
    enabled: Boolean(id),
  });

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page}>
        <Link href="/submissions" asChild><Text style={styles.link}>← Back to Submissions</Text></Link>
        {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
        {error ? <Text style={styles.error}>Submission not found.</Text> : null}
        {data ? (
          <View style={styles.card}>
            <Text style={styles.title}>{data.questionTitle}</Text>
            <Text style={styles.meta}>Language: {data.language} · Status: {data.status}</Text>
            <Text style={styles.meta}>Runtime: {data.executionTime} · Memory: {data.memory}</Text>
            <Text style={styles.meta}>{data.passedTestCases} / {data.totalTestCases} test cases passed</Text>
            <Text style={styles.meta}>{new Date(data.createdAt).toLocaleString()}</Text>
            <Text style={styles.section}>Submitted Code</Text>
            <View style={styles.code}>
              <Text style={styles.codeText}>{data.sourceCode}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.lg, gap: space.md, maxWidth: 800, width: '100%', alignSelf: 'center' },
  link: { color: colors.primary, fontWeight: '600' },
  error: { color: colors.danger },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: space.lg, gap: space.sm },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  meta: { fontSize: type.small, color: colors.textMuted },
  section: { fontWeight: '700', marginTop: space.md, color: colors.text },
  code: { backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: space.md },
  codeText: { fontSize: type.small, color: colors.text, fontFamily: Platform.OS === 'web' ? 'monospace' : undefined },
});
