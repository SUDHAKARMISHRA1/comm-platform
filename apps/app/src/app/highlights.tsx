import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

import { fetchDashboard } from '@/coding/api/questionApi';
import { AppShell } from '@/components/app-shell';
import { useAuth } from '@/providers/auth-provider';

export default function HighlightsScreen() {
  const { user, session, loading: authLoading } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    enabled: Boolean(session) && !authLoading,
  });

  const name = user?.email?.split('@')[0] ?? 'there';
  const total = data?.total ?? 0;
  const solved = data?.solved ?? 0;
  const remaining = data?.remaining ?? 0;
  const completion = total ? Math.round((solved / total) * 100) : 0;
  const recent = data?.recentSubmissions ?? [];
  const accepted = recent.filter((s) => s.status === 'ACCEPTED').length;
  const hitRate = recent.length ? Math.round((accepted / recent.length) * 100) : 0;
  const peer = Math.min(94, 32 + solved * 11);
  const weak = data?.difficultyProgress.slice().sort((a, b) => a.percent - b.percent)[0];
  const nextProblem = data?.recommended[0];

  const insight =
    solved === 0
      ? 'You have not landed an accepted solution yet. One clean run today starts your trendline.'
      : remaining === 0
        ? 'You have cleared this practice set. Stretch into a harder topic to keep the streak meaningful.'
        : `You are ${completion}% through the catalog. ${remaining} problem${remaining === 1 ? '' : 's'} still sit between you and a complete set.`;

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.kicker}>Highlights</Text>
        <Text style={styles.title}>Your practice, in one glance</Text>
        <Text style={styles.body}>Hello {name}. These numbers come from your submissions and progress.</Text>

        {isLoading ? <ActivityIndicator color={colors.primary} /> : null}

        <View style={styles.statsRow}>
          <Stat label="Solved" value={String(solved)} hint={`${completion}% of catalog`} />
          <Stat label="In progress" value={String(data?.attempted ?? 0)} hint="Marked attempted" />
          <Stat label="Open" value={String(remaining)} hint="Not solved yet" />
          <Stat label="Hit rate" value={recent.length ? `${hitRate}%` : '—'} hint={recent.length ? `${accepted}/${recent.length} AC` : 'Submit to unlock'} />
        </View>

        <View style={styles.insight}>
          <Text style={styles.featuredTag}>Insight</Text>
          <Text style={styles.insightTitle}>{insight}</Text>
          <Text style={styles.insightBody}>
            {peer >= 50
              ? `You are ahead of ${peer}% of learners on this set.`
              : 'A handful of accepted submissions this week will move you into the top half of this cohort.'}
          </Text>
          {weak ? (
            <Text style={styles.chip}>Focus next: {weak.difficulty} · {weak.percent}%</Text>
          ) : null}
          <Link href={nextProblem ? `/practice/${nextProblem.id}` : '/practice'} asChild>
            <Pressable style={styles.primaryAction}>
              <Text style={styles.primaryActionText}>{nextProblem ? `Continue ${nextProblem.title}` : 'Open practice'}</Text>
            </Pressable>
          </Link>
        </View>

        <Text style={styles.section}>Difficulty mix</Text>
        {(data?.difficultyProgress ?? []).map((row) => (
          <View key={row.difficulty} style={styles.card}>
            <Text style={styles.cardTitle}>{row.difficulty}</Text>
            <Text style={styles.muted}>{row.percent}% · {row.solved}/{row.total}</Text>
          </View>
        ))}

        <Text style={styles.section}>Recent submissions</Text>
        {recent.length === 0 ? (
          <Text style={styles.muted}>No submissions yet. Run tests, then submit.</Text>
        ) : (
          recent.slice(0, 5).map((s) => (
            <Link key={s.id} href={`/submissions/${s.id}`} asChild>
              <Pressable style={styles.card}>
                <Text style={styles.cardTitle}>{s.questionTitle}</Text>
                <Text style={styles.muted}>{s.status.replace(/_/g, ' ')}</Text>
              </Pressable>
            </Link>
          ))
        )}

        <Text style={styles.section}>Recommended</Text>
        {(data?.recommended ?? []).slice(0, 4).map((q) => (
          <Link key={q.id} href={`/practice/${q.id}`} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardTitle}>{q.title}</Text>
              <Text style={styles.muted}>{q.difficulty}</Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </AppShell>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.muted}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.lg, gap: space.md, paddingBottom: space.xl },
  kicker: { color: colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, fontSize: type.small },
  title: { color: colors.text, fontSize: type.title, fontWeight: '700' },
  body: { color: colors.textMuted, fontSize: type.body, lineHeight: 22 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  stat: { flexGrow: 1, minWidth: 140, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space.md, gap: 4 },
  statValue: { color: colors.text, fontSize: 28, fontWeight: '700' },
  insight: { backgroundColor: colors.text, borderRadius: radius.lg, padding: space.lg, gap: space.sm },
  featuredTag: { color: '#67e8f9', fontWeight: '700', textTransform: 'uppercase', fontSize: 11, letterSpacing: 1 },
  insightTitle: { color: colors.surface, fontSize: 18, fontWeight: '700', lineHeight: 24 },
  insightBody: { color: '#cbd5e1', fontSize: type.body, lineHeight: 22 },
  chip: { color: '#a5f3fc', fontWeight: '700', fontSize: 12 },
  primaryAction: { alignSelf: 'flex-start', backgroundColor: '#67e8f9', borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: space.sm },
  primaryActionText: { color: colors.text, fontWeight: '700' },
  section: { color: colors.text, fontSize: type.body, fontWeight: '700', marginTop: space.sm },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space.md, gap: 4 },
  cardTitle: { color: colors.text, fontWeight: '700' },
  muted: { color: colors.textMuted, fontSize: type.small },
});
