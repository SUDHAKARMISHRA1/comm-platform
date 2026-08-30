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
import { fetchCatalog, fetchQuestions } from '@/coding/api/questionApi';
import { useAuth } from '@/providers/auth-provider';

const STATUSES = ['ALL', 'SOLVED', 'ATTEMPTED', 'NOT_ATTEMPTED'];

export default function PracticeScreen() {
  const { session, loading: authLoading } = useAuth();
  const params = useLocalSearchParams<{ q?: string; page?: string }>();
  const [search, setSearch] = useState(params.q ?? '');
  const [skill, setSkill] = useState('');
  const [level, setLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState('ALL');
  const page = Number(params.page ?? 1);

  const catalogQuery = useQuery({
    queryKey: ['catalog'],
    queryFn: fetchCatalog,
    enabled: Boolean(session) && !authLoading,
  });

  const skills = catalogQuery.data?.skills ?? [];
  const levels = catalogQuery.data?.levels ?? [];
  const topics = catalogQuery.data?.topics ?? [];

  const queryParams = useMemo(
    () => ({
      q: search,
      skill: skill || undefined,
      level: level || undefined,
      topic: topic || undefined,
      status,
      page,
    }),
    [search, skill, level, topic, status, page],
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['questions', queryParams],
    queryFn: () => fetchQuestions(queryParams),
    enabled: Boolean(session) && !authLoading,
  });

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.title}>Practice</Text>
        {catalogQuery.data?.settings.maintenanceMessage ? (
          <Text style={styles.warn}>{catalogQuery.data.settings.maintenanceMessage}</Text>
        ) : null}
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search title, ID, or topic"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Pressable onPress={() => setSkill('')} style={[styles.chip, !skill && styles.chipActive]}>
            <Text style={[styles.chipText, !skill && styles.chipTextActive]}>All skills</Text>
          </Pressable>
          {skills.map((s) => (
            <Pressable key={s.id} onPress={() => setSkill(s.id)} style={[styles.chip, skill === s.id && styles.chipActive]}>
              <Text style={[styles.chipText, skill === s.id && styles.chipTextActive]}>{s.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Pressable onPress={() => setLevel('')} style={[styles.chip, !level && styles.chipActive]}>
            <Text style={[styles.chipText, !level && styles.chipTextActive]}>All levels</Text>
          </Pressable>
          {levels.map((l) => (
            <Pressable key={l.id} onPress={() => setLevel(l.id)} style={[styles.chip, level === l.id && styles.chipActive]}>
              <Text style={[styles.chipText, level === l.id && styles.chipTextActive]}>{l.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Pressable onPress={() => setTopic('')} style={[styles.chip, !topic && styles.chipActive]}>
            <Text style={[styles.chipText, !topic && styles.chipTextActive]}>All topics</Text>
          </Pressable>
          {topics.map((t) => (
            <Pressable key={t.id} onPress={() => setTopic(t.name)} style={[styles.chip, topic === t.name && styles.chipActive]}>
              <Text style={[styles.chipText, topic === t.name && styles.chipTextActive]}>{t.name}</Text>
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

        {authLoading || isLoading ? (
          <View style={styles.row}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.muted}>Loading questions...</Text>
          </View>
        ) : null}
        {error ? <Text style={styles.error}>{error instanceof Error ? error.message : 'Failed to load questions.'}</Text> : null}

        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={[styles.th, styles.colId]}>#</Text>
            <Text style={[styles.th, styles.colTitle]}>Question</Text>
            <Text style={[styles.th, styles.colDiff]}>Level</Text>
            <Text style={[styles.th, styles.colTopic]}>Topic</Text>
            <Text style={[styles.th, styles.colStatus]}>Status</Text>
          </View>
          {data?.questions.map((q) => (
            <Link key={q.id} href={`/practice/${q.id}`} asChild>
              <Pressable style={styles.tableRow}>
                <Text style={[styles.td, styles.colId]}>{q.id}</Text>
                <Text style={[styles.td, styles.colTitle, styles.link]}>{q.title}</Text>
                <View style={styles.colDiff}>
                  <DifficultyBadge difficulty={q.difficulty} />
                </View>
                <Text style={[styles.td, styles.colTopic]}>{q.topics[0]}</Text>
                <View style={styles.colStatus}>
                  <StatusBadge status={q.status} />
                </View>
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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: space.md,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  filters: { flexDirection: 'row', gap: space.xs, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: type.small, color: colors.textMuted, fontWeight: '600' },
  chipTextActive: { color: colors.primaryText },
  muted: { color: colors.textMuted },
  warn: { color: colors.warning },
  error: { color: colors.danger },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  table: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, overflow: 'hidden' },
  tableHead: { flexDirection: 'row', backgroundColor: colors.surfaceMuted, padding: space.sm, gap: space.sm },
  tableRow: {
    flexDirection: 'row',
    padding: space.sm,
    gap: space.sm,
    borderTopWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  th: { fontSize: type.small, fontWeight: '700', color: colors.textMuted },
  td: { fontSize: type.small, color: colors.text },
  colId: { width: 32 },
  colTitle: { flex: 2 },
  colDiff: { flex: 1 },
  colTopic: { flex: 1 },
  colStatus: { flex: 1 },
  link: { color: colors.primary, fontWeight: '600' },
});
