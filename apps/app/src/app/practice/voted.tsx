import { Link, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

import { AppShell } from '@/components/app-shell';
import { DifficultyBadge } from '@/coding/components/DifficultyBadge';
import { StatusBadge } from '@/coding/components/StatusBadge';
import { VoteButton } from '@/coding/components/VoteButton';
import { fetchVotedQuestions } from '@/coding/api/questionApi';
import { useAuth } from '@/providers/auth-provider';

const PAGE_SIZE = 10;

export default function VotedProblemsScreen() {
  const { session, loading: authLoading } = useAuth();
  const params = useLocalSearchParams<{ skill?: string; page?: string }>();
  const skill = typeof params.skill === 'string' ? params.skill : '';
  const page = Math.max(1, Number(params.page ?? '1') || 1);
  const enabled = Boolean(session) && !authLoading;

  const query = useQuery({
    queryKey: ['voted-questions', skill, page],
    queryFn: () => fetchVotedQuestions({ skill: skill || undefined, page, pageSize: PAGE_SIZE }),
    enabled,
  });

  const total = query.data?.pagination.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page}>
        <Link href="/practice" asChild>
          <Pressable>
            <Text style={styles.back}>← Back to Practice</Text>
          </Pressable>
        </Link>
        <Text style={styles.kicker}>Interview votes</Text>
        <Text style={styles.title}>Problems ranked by interview votes</Text>
        <Text style={styles.lead}>
          These are problems people marked after seeing them in a recent interview. Use pagination to browse the full ranked list.
        </Text>

        {query.isLoading ? (
          <View style={styles.row}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.muted}>Loading ranked problems…</Text>
          </View>
        ) : null}
        {query.error ? <Text style={styles.err}>Could not load voted problems.</Text> : null}
        {query.data && query.data.questions.length === 0 ? (
          <Text style={styles.muted}>No interview votes yet. Vote on a problem from Practice if you saw it in an interview.</Text>
        ) : null}

        {query.data?.questions.map((q, i) => (
          <View key={q.id} style={styles.card}>
            <Text style={styles.rank}>{String((page - 1) * PAGE_SIZE + i + 1).padStart(2, '0')}</Text>
            <View style={styles.body}>
              <Link href={`/practice/${q.id}` as never} asChild>
                <Pressable>
                  <Text style={styles.qtitle}>{q.title}</Text>
                </Pressable>
              </Link>
              <View style={styles.meta}>
                <DifficultyBadge difficulty={q.difficulty} />
                <StatusBadge status={q.status} />
              </View>
            </View>
            <VoteButton questionId={q.id} voteCount={q.voteCount} votedByMe={q.votedByMe} />
          </View>
        ))}

        {total > 0 ? (
          <View style={styles.pager}>
            {page > 1 ? (
              <Link href={`/practice/voted?skill=${encodeURIComponent(skill)}&page=${page - 1}` as never} asChild>
                <Pressable style={styles.pageBtn}><Text style={styles.pageBtnText}>Previous</Text></Pressable>
              </Link>
            ) : <View />}
            <Text style={styles.muted}>Page {page} of {pageCount}</Text>
            {page < pageCount ? (
              <Link href={`/practice/voted?skill=${encodeURIComponent(skill)}&page=${page + 1}` as never} asChild>
                <Pressable style={styles.pageBtn}><Text style={styles.pageBtnText}>Next</Text></Pressable>
              </Link>
            ) : <View />}
          </View>
        ) : null}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.md, gap: space.md, maxWidth: 800, width: '100%', alignSelf: 'center', paddingBottom: space.xl },
  back: { color: colors.primary, fontWeight: '700' },
  kicker: { color: colors.primary, fontWeight: '700', letterSpacing: 1.1, textTransform: 'uppercase', fontSize: 11 },
  title: { fontSize: type.title, fontWeight: '700', color: colors.text },
  lead: { color: colors.textMuted, lineHeight: 22 },
  muted: { color: colors.textMuted },
  err: { color: colors.danger },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: space.md,
  },
  rank: { width: 28, color: colors.primary, fontWeight: '800' },
  body: { flex: 1, minWidth: 0, gap: 6 },
  qtitle: { color: colors.text, fontWeight: '700', fontSize: type.body },
  meta: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  pager: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.md },
  pageBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: space.md, paddingVertical: space.sm, backgroundColor: colors.surface },
  pageBtnText: { color: colors.text, fontWeight: '700' },
});
