import { Link } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

import { AppShell } from '@/components/app-shell';
import { usePracticeBoard } from '@/coding/hooks/usePracticeBoard';

export default function PracticeSkillsScreen() {
  const board = usePracticeBoard();

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page}>
        <Link href={'/practice' as never} asChild>
          <Pressable>
            <Text style={styles.back}>← Practice</Text>
          </Pressable>
        </Link>
        <Text style={styles.kicker}>Practice</Text>
        <Text style={styles.title}>All skills</Text>
        {board.catalogQuery.isLoading ? <ActivityIndicator color={colors.primary} /> : null}
        {board.skills.map((s) => {
          const count = board.skillCounts.get(s.id) ?? 0;
          return (
            <Link key={s.id} href={`/practice?skill=${s.id}` as never} asChild>
              <Pressable style={styles.track}>
                <Text style={styles.trackName}>{s.name}</Text>
                <Text style={styles.trackCount}>{count} problems</Text>
              </Pressable>
            </Link>
          );
        })}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.lg, gap: space.md, backgroundColor: colors.bg },
  back: { color: colors.primary, fontWeight: '700' },
  kicker: { color: colors.primary, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', fontSize: 11 },
  title: { fontSize: type.title, fontWeight: '700', color: colors.text },
  track: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: space.md,
  },
  trackName: { fontWeight: '700', color: colors.text, fontSize: type.body },
  trackCount: { color: colors.textMuted, fontSize: type.small, marginTop: 4 },
});
