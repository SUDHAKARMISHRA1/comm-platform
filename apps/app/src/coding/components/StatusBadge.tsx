import { StyleSheet, Text } from 'react-native';

import { colors, type } from '@comm-platform/ui';
import type { QuestionStatus } from '@comm-platform/coding';

const LABELS: Record<QuestionStatus, string> = {
  SOLVED: '✓ Solved',
  ATTEMPTED: '◐ Attempted',
  NOT_ATTEMPTED: '○ Not Attempted',
};

export function StatusBadge({ status }: { status: QuestionStatus }) {
  const color =
    status === 'SOLVED' ? colors.success : status === 'ATTEMPTED' ? colors.primary : colors.textMuted;
  return <Text style={[styles.text, { color }]}>{LABELS[status]}</Text>;
}

const styles = StyleSheet.create({
  text: { fontSize: type.small, fontWeight: '600' },
});
