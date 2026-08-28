import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

export function ProgressBar({ percent, label }: { percent: number; label: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.pct}>{percent}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(100, percent)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: type.small, color: colors.text, fontWeight: '600' },
  pct: { fontSize: type.small, color: colors.textMuted },
  track: { height: 8, backgroundColor: colors.surfaceMuted, borderRadius: radius.sm, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary },
});
