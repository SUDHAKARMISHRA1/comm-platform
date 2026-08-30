import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

import { AppShell } from '@/components/app-shell';
import { DifficultyBadge } from '@/coding/components/DifficultyBadge';
import { ProgressBar } from '@/coding/components/ProgressBar';
import { StatusBadge } from '@/coding/components/StatusBadge';
import { SubmissionCalendar } from '@/coding/components/SubmissionCalendar';
import { fetchDashboard } from '@/coding/api/questionApi';
import { fetchSubmissions } from '@/coding/api/submissionApi';
import { inLastMonths } from '@/coding/activity';
import { useAuth } from '@/providers/auth-provider';

const HISTORY_MONTHS = 3;

export default function DashboardScreen() {
  const { user, session, loading: authLoading } = useAuth();
  const [historyOpen, setHistoryOpen] = useState(false);
  const enabled = Boolean(session) && !authLoading;
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    enabled,
  });
  const subs = useQuery({
    queryKey: ['submissions'],
    queryFn: fetchSubmissions,
    enabled,
  });
  const submissions = subs.data?.submissions ?? [];
  const preview = submissions.slice(0, 2);
  const history = useMemo(
    () => submissions.filter((s) => inLastMonths(s.createdAt, HISTORY_MONTHS)),
    [submissions],
  );

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.kicker}>Dashboard</Text>
        <Text style={styles.title}>Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!</Text>

        {isLoading || subs.isLoading ? <ActivityIndicator color={colors.primary} /> : null}
        {error ? <Text style={styles.error}>Could not load dashboard.</Text> : null}

        <SubmissionCalendar submissions={submissions} />

        {data ? (
          <>
            <View style={styles.statsRow}>
              {[
                { label: 'Solved', value: data.solved },
                { label: 'Attempted', value: data.attempted },
                { label: 'Total', value: data.total },
              ].map((s) => (
                <View key={s.label} style={styles.statCard}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Progress</Text>
              {data.difficultyProgress.map((d) => (
                <ProgressBar key={d.difficulty} label={d.difficulty} percent={d.percent} />
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Recent Practice</Text>
              {data.recentPractice.map((item) => (
                <Link key={item.questionId} href={`/practice/${item.questionId}`} asChild>
                  <Pressable style={styles.listRow}>
                    <Text style={styles.rowTitle}>{item.title}</Text>
                    <StatusBadge status={item.status} />
                  </Pressable>
                </Link>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Recommended</Text>
              {data.recommended.map((q) => (
                <Link key={q.id} href={`/practice/${q.id}`} asChild>
                  <Pressable style={styles.listRow}>
                    <Text style={styles.rowTitle}>{q.title}</Text>
                    <DifficultyBadge difficulty={q.difficulty} />
                  </Pressable>
                </Link>
              ))}
            </View>
          </>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Submissions</Text>
          <Text style={styles.hint}>Latest two by problem name. Expand for the last {HISTORY_MONTHS} months.</Text>
          {preview.map((s) => (
            <Link key={s.id} href={`/submissions/${s.id}`} asChild>
              <Pressable style={styles.preview}>
                <Text style={styles.rowTitle}>{s.questionTitle}</Text>
                <Text style={styles.hint}>{s.status.replace(/_/g, ' ')} · {s.language} · {new Date(s.createdAt).toLocaleString()}</Text>
              </Pressable>
            </Link>
          ))}
          {preview.length === 0 ? <Text style={styles.hint}>No submissions yet.</Text> : null}
          <Pressable style={styles.collapse} onPress={() => setHistoryOpen((o) => !o)}>
            <Text style={styles.collapseText}>{historyOpen ? 'Collapse history' : `Show last ${HISTORY_MONTHS} months`}</Text>
          </Pressable>
          {historyOpen ? (
            <ScrollView style={styles.tableScroll} nestedScrollEnabled>
              {history.map((s) => (
                <Link key={s.id} href={`/submissions/${s.id}`} asChild>
                  <Pressable style={styles.listRow}>
                    <Text style={styles.rowTitle}>{s.questionTitle}</Text>
                    <Text style={styles.hint}>{new Date(s.createdAt).toLocaleDateString()}</Text>
                  </Pressable>
                </Link>
              ))}
            </ScrollView>
          ) : null}
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.lg, gap: space.md, maxWidth: 900, width: '100%', alignSelf: 'center' },
  kicker: { color: colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, fontSize: type.small },
  title: { color: colors.text, fontSize: type.title, fontWeight: '700' },
  error: { color: colors.danger },
  hint: { color: colors.textMuted, fontSize: type.small },
  statsRow: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: 100, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: space.md, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: type.small, color: colors.textMuted, marginTop: 4 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: space.lg, gap: space.md },
  sectionTitle: { fontSize: type.body, fontWeight: '700', color: colors.text },
  listRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: space.sm, borderBottomWidth: 1, borderColor: colors.border },
  rowTitle: { color: colors.text, fontWeight: '600', flex: 1 },
  preview: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space.md, gap: 4, backgroundColor: colors.surfaceMuted },
  collapse: { alignSelf: 'flex-start', backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: space.sm },
  collapseText: { color: colors.primaryText, fontWeight: '700' },
  tableScroll: { maxHeight: 240 },
});
