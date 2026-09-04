import { Link } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';
import type { Difficulty, QuestionSummary } from '@comm-platform/coding';

import { AppShell } from '@/components/app-shell';
import { DifficultyBadge } from '@/coding/components/DifficultyBadge';
import { StatusBadge } from '@/coding/components/StatusBadge';
import { VoteButton } from '@/coding/components/VoteButton';
import { DIFFICULTIES, PRACTICE_STATUSES, usePracticeBoard } from '@/coding/hooks/usePracticeBoard';

const DIFF_META: Record<Difficulty, string> = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

export default function PracticeScreen() {
  const board = usePracticeBoard();
  const skillName = board.selectedSkill?.name ?? 'Java';

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.head}>
          <View style={styles.headCopy}>
            <Text style={styles.kicker}>Practice</Text>
            <Text style={styles.title}>Build fluency</Text>
          </View>
          <TextInput
            value={board.search}
            onChangeText={board.setSearch}
            placeholder="Search problems"
            placeholderTextColor={colors.textMuted}
            style={styles.search}
          />
        </View>

        {board.maintenanceMessage ? <Text style={styles.warn}>{board.maintenanceMessage}</Text> : null}
        {board.authLoading || board.catalogQuery.isLoading ? (
          <View style={styles.row}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.muted}>Loading catalog…</Text>
          </View>
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tracks}>
          {board.featuredSkills.map((s) => {
            const active = s.id === board.skill;
            const count = board.skillCounts.get(s.id) ?? 0;
            return (
              <Pressable key={s.id} onPress={() => board.selectSkill(s.id)} style={[styles.track, active && styles.trackActive]}>
                <Text style={[styles.trackName, active && styles.trackNameActive]}>{s.name}</Text>
                <Text style={styles.trackCount}>{count} problems</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {board.hasMoreSkills ? (
          <Link href={'/practice/skills' as never} asChild>
            <Pressable>
              <Text style={styles.viewAll}>See more skills</Text>
            </Pressable>
          </Link>
        ) : null}

        <View style={styles.stats}>
          <Stat label={`In ${skillName}`} value={String(board.stats.total)} />
          <Stat label="Solved" value={String(board.stats.solved)} />
          <Stat label="In progress" value={String(board.stats.attempted)} />
        </View>

        <View style={styles.card}>
          <Text style={styles.kicker}>Interview picks</Text>
          <Text style={styles.sectionTitle}>Top problems · {skillName}</Text>
          <Link href={`/practice/voted?skill=${board.skill}` as never} asChild>
            <Pressable>
              <Text style={styles.viewAll}>View more</Text>
            </Pressable>
          </Link>
          {board.picks.length === 0 ? (
            <Text style={styles.muted}>No interview votes in this section yet. Vote on a problem if you saw it in a recent interview.</Text>
          ) : (
            board.picks.map((q, i) => <PickRow key={q.id} q={q} rank={i + 1} />)
          )}
        </View>

        <Text style={styles.filterLabel}>Level</Text>
        <ChipRow
          options={[{ id: '', label: 'All levels' }, ...board.levels.map((l) => ({ id: l.id, label: l.name }))]}
          value={board.level}
          onChange={board.setLevel}
        />
        <Text style={styles.filterLabel}>Topic</Text>
        <ChipRow
          options={[{ id: '', label: 'All topics' }, ...board.topics.map((t) => ({ id: t.name, label: t.name }))]}
          value={board.topic}
          onChange={board.setTopic}
        />
        <Text style={styles.filterLabel}>Status</Text>
        <ChipRow
          options={PRACTICE_STATUSES.map((s) => ({ id: s, label: s === 'ALL' ? 'All status' : s.replace('_', ' ') }))}
          value={board.status}
          onChange={(v) => board.setStatus(v as (typeof PRACTICE_STATUSES)[number])}
        />
        {board.filtersActive ? (
          <Pressable onPress={board.resetFilters} style={styles.reset}>
            <Text style={styles.resetText}>Reset filters</Text>
          </Pressable>
        ) : null}

        {DIFFICULTIES.map((diff) => {
          const rows = board.grouped[diff];
          const open = board.expanded === diff;
          const shown = open ? rows : rows.slice(0, 3);
          return (
            <View key={diff} style={styles.card}>
              <View style={styles.boardHead}>
                <Text style={styles.sectionTitle}>{DIFF_META[diff]} · {rows.length}</Text>
                <Pressable onPress={() => board.viewAll(diff)}>
                  <Text style={styles.viewAll}>{open ? 'Show less' : 'View all'}</Text>
                </Pressable>
              </View>
              {shown.length === 0 ? (
                <Text style={styles.muted}>No {DIFF_META[diff].toLowerCase()} problems match.</Text>
              ) : (
                shown.map((q) => <BoardRow key={q.id} q={q} />)
              )}
            </View>
          );
        })}
      </ScrollView>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function ChipRow({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <Pressable key={opt.id || 'all'} onPress={() => onChange(opt.id)} style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function PickRow({ q, rank }: { q: QuestionSummary; rank: number }) {
  return (
    <View style={styles.pick}>
      <Link href={`/practice/${q.id}`} asChild>
        <Pressable style={styles.pickMain}>
          <Text style={styles.rank}>{String(rank).padStart(2, '0')}</Text>
          <View style={styles.pickBody}>
            <Text style={styles.pickTitle}>{q.title}</Text>
            <Text style={styles.muted}>{q.topics[0] ?? 'General'}</Text>
          </View>
          <DifficultyBadge difficulty={q.difficulty} />
        </Pressable>
      </Link>
      <VoteButton questionId={q.id} voteCount={q.voteCount} votedByMe={q.votedByMe} />
    </View>
  );
}

function BoardRow({ q }: { q: QuestionSummary }) {
  return (
    <View style={styles.boardRow}>
      <Link href={`/practice/${q.id}`} asChild>
        <Pressable style={styles.boardMain}>
          <Text style={styles.pickTitle}>{q.title}</Text>
          <StatusBadge status={q.status} />
        </Pressable>
      </Link>
      <VoteButton questionId={q.id} voteCount={q.voteCount} votedByMe={q.votedByMe} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.md, gap: space.md, maxWidth: 1000, width: '100%', alignSelf: 'center', paddingBottom: space.xl },
  head: { gap: space.sm },
  headCopy: { gap: 4 },
  kicker: { color: colors.primary, fontWeight: '700', letterSpacing: 1.1, textTransform: 'uppercase', fontSize: 11 },
  title: { fontSize: type.title, fontWeight: '700', color: colors.text },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  warn: { color: colors.warning },
  muted: { color: colors.textMuted, fontSize: type.small },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  tracks: { gap: space.sm, paddingRight: space.md },
  track: {
    minWidth: 140,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: space.md,
    gap: 4,
  },
  trackActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  trackName: { fontWeight: '700', color: colors.text, fontSize: type.body },
  trackNameActive: { color: colors.primary },
  trackCount: { color: colors.textMuted, fontSize: type.small },
  stats: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
  stat: {
    flexGrow: 1,
    minWidth: 100,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: space.md,
    gap: 4,
  },
  statValue: { fontSize: 22, fontWeight: '700', color: colors.text },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.sm,
  },
  sectionTitle: { fontSize: type.body, fontWeight: '700', color: colors.text },
  pick: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.sm },
  pickMain: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flex: 1, minWidth: 0 },
  rank: { width: 28, color: colors.primary, fontWeight: '800', fontSize: type.small },
  pickBody: { flex: 1, minWidth: 0, gap: 2 },
  pickTitle: { color: colors.text, fontWeight: '700' },
  filterLabel: { color: colors.textMuted, fontWeight: '700', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 },
  chips: { gap: space.xs },
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
  reset: { alignSelf: 'flex-start', paddingVertical: space.sm },
  resetText: { color: colors.primary, fontWeight: '700' },
  boardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { color: colors.primary, fontWeight: '700', fontSize: type.small },
  boardRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.sm, borderTopWidth: 1, borderColor: colors.borderMuted },
  boardMain: { flex: 1, minWidth: 0, gap: 4 },
});
