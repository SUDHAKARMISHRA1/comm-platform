import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

import { AppShell } from '@/components/app-shell';
import { DifficultyBadge } from '@/coding/components/DifficultyBadge';
import { StatusBadge } from '@/coding/components/StatusBadge';
import { fetchQuestions } from '@/coding/api/questionApi';

const TOPICS = ['Array', 'String', 'Searching', 'Dynamic Programming', 'Math', 'HashMap'];
const DIFFICULTIES = ['', 'EASY', 'MEDIUM', 'HARD'];
const STATUSES = ['ALL', 'SOLVED', 'ATTEMPTED', 'NOT_ATTEMPTED'];

export default function PracticeScreen() {
  const params = useLocalSearchParams<{ q?: string; page?: string }>();
  const [search, setSearch] = useState(params.q ?? '');
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState('ALL');
  const page = Number(params.page ?? 1);

  const queryParams = useMemo(
    () => ({ q: search, difficulty: difficulty || undefined, topic: topic || undefined, status, page }),
    [search, difficulty, topic, status, page],
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['questions', queryParams],
    queryFn: () => fetchQuestions(queryParams),
  });

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.title}>Practice</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search title, ID, or topic"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {DIFFICULTIES.map((d) => (
            <Pressable key={d || 'all'} onPress={() => setDifficulty(d)} style={[styles.chip, difficulty === d && styles.chipActive]}>
              <Text style={[styles.chipText, difficulty === d && styles.chipTextActive]}>{d || 'All levels'}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Pressable onPress={() => setTopic('')} style={[styles.chip, !topic && styles.chipActive]}>
            <Text style={[styles.chipText, !topic && styles.chipTextActive]}>All topics</Text>
          </Pressable>
          {TOPICS.map((t) => (
            <Pressable key={t} onPress={() => setTopic(t)} style={[styles.chip, topic === t && styles.chipActive]}>
              <Text style={[styles.chipText, topic === t && styles.chipTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.filters}>
          {STATUSES.map((s) => (
            <Pressable key={s} onPress={() => setStatus(s)} style={[styles.chip, status === s && styles.chipActive]}>
              <Text style={[styles.chipText, status === s && styles.chipTextActive]}>{s.replace('_', ' ')}</Text>
            </Pressable>
          ))}
        </View>

        {isLoading ? <Text style={styles.muted}>Loading questions...</Text> : null}
        {error ? <Text style={styles.error}>Failed to load questions.</Text> : null}

        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={[styles.th, styles.colId]}>#</Text>
            <Text style={[styles.th, styles.colTitle]}>Question</Text>
            <Text style={[styles.th, styles.colDiff]}>Difficulty</Text>
            <Text style={[styles.th, styles.colTopic]}>Topic</Text>
            <Text style={[styles.th, styles.colStatus]}>Status</Text>
          </View>
          {data?.questions.map((q) => (
            <Link key={q.id} href={`/practice/${q.id}`} asChild>
              <Pressable style={styles.tableRow}>
                <Text style={[styles.td, styles.colId]}>{q.id}</Text>
                <Text style={[styles.td, styles.colTitle, styles.link]}>{q.title}</Text>
                <View style={styles.colDiff}><DifficultyBadge difficulty={q.difficulty} /></View>
                <Text style={[styles.td, styles.colTopic]}>{q.topics[0]}</Text>
                <View style={styles.colStatus}><StatusBadge status={q.status} /></View>
              </Pressable>
            </Link>
          ))}
        </View>

        {data ? (
          <Text style={styles.muted}>
            Page {data.pagination.page} · {data.pagination.total} questions
          </Text>
        ) : null}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.lg, gap: space.md, maxWidth: 1000, width: '100%', alignSelf: 'center' },
  title: { fontSize: type.title, fontWeight: '700', color: colors.text },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space.md, backgroundColor: colors.surface, color: colors.text },
  filters: { flexDirection: 'row', gap: space.xs, flexWrap: 'wrap' },
  chip: { paddingHorizontal: space.sm, paddingVertical: 6, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: type.small, color: colors.textMuted, fontWeight: '600' },
  chipTextActive: { color: colors.primaryText },
  muted: { color: colors.textMuted },
  error: { color: colors.danger },
  table: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, overflow: 'hidden' },
  tableHead: { flexDirection: 'row', backgroundColor: colors.surfaceMuted, padding: space.sm, gap: space.sm },
  tableRow: { flexDirection: 'row', padding: space.sm, gap: space.sm, borderTopWidth: 1, borderColor: colors.border, alignItems: 'center' },
  th: { fontSize: type.small, fontWeight: '700', color: colors.textMuted },
  td: { fontSize: type.small, color: colors.text },
  colId: { width: 32 },
  colTitle: { flex: 2 },
  colDiff: { flex: 1 },
  colTopic: { flex: 1 },
  colStatus: { flex: 1 },
  link: { color: colors.primary, fontWeight: '600' },
});
