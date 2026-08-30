import { Text, View, StyleSheet } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

import { AppShell } from '@/components/app-shell';

export function ComingSoonScreen({ title }: { title: string }) {
  return (
    <AppShell>
      <View style={styles.wrap}>
        <View style={styles.card}>
          <Text style={styles.kicker}>{title}</Text>
          <Text style={styles.title}>Coming soon</Text>
          <Text style={styles.body}>
            This area is not available yet. You can keep using practice, dashboard, and submissions in the meantime.
          </Text>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: space.lg, alignItems: 'center', justifyContent: 'center' },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: space.xl,
    gap: space.sm,
  },
  kicker: { color: colors.primary, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', fontSize: 11 },
  title: { color: colors.text, fontSize: type.title, fontWeight: '700' },
  body: { color: colors.textMuted, fontSize: type.body, lineHeight: 24 },
});
