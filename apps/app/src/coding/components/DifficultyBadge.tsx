import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';
import type { Difficulty } from '@comm-platform/coding';

const COLORS: Record<Difficulty, { bg: string; text: string }> = {
  EASY: { bg: '#d1fae5', text: '#047857' },
  MEDIUM: { bg: '#fef3c7', text: '#b45309' },
  HARD: { bg: '#fee2e2', text: '#b91c1c' },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const c = COLORS[difficulty];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.text }]}>{difficulty}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: space.sm, paddingVertical: 2, borderRadius: radius.sm },
  text: { fontSize: 11, fontWeight: '700' },
});
