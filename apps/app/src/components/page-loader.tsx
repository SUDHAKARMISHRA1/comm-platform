import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '@comm-platform/ui';

import { loaderMessageAt } from '@/components/page-loader-copy';

export function PageLoader({
  fullScreen,
  compact,
  message,
}: {
  fullScreen?: boolean;
  compact?: boolean;
  message?: string;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (message) return undefined;
    const id = setInterval(() => setTick((n) => n + 1), 2400);
    return () => clearInterval(id);
  }, [message]);

  const text = message ?? loaderMessageAt(tick);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={text}
      style={[styles.wrap, fullScreen && styles.full, compact && styles.compact]}
    >
      <ActivityIndicator size={compact ? 'small' : 'large'} color={colors.primary} />
      <Text style={[styles.text, compact && styles.textCompact]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    paddingVertical: space.xl,
    paddingHorizontal: space.lg,
  },
  full: { flex: 1, minHeight: 280, paddingVertical: space.xl, backgroundColor: colors.bg },
  compact: { flexDirection: 'row', paddingVertical: space.md, gap: space.sm },
  text: {
    color: colors.textMuted,
    fontSize: type.body,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
  textCompact: { fontSize: type.small, textAlign: 'left', maxWidth: '100%' },
});
