import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';

import { colors, radius, space, type } from '@comm-platform/ui';

import { AppShell } from '@/components/app-shell';

type AuthScreenProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthScreen({ title, subtitle, children }: AuthScreenProps) {
  return (
    <AppShell>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView
          scrollEnabled={Platform.OS !== 'web'}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.kicker}>Comm Platform</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppShell>
  );
}

export function FormMessage({ message, tone = 'danger' }: { message?: string; tone?: 'danger' | 'success' }) {
  if (!message) return null;
  return (
    <Text accessibilityLiveRegion="polite" style={[styles.message, tone === 'success' ? styles.success : styles.danger]}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: space.lg, alignItems: 'center' },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.lg,
    gap: space.md,
  },
  kicker: {
    color: colors.primary,
    fontSize: type.small,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: { color: colors.text, fontSize: type.title, fontWeight: '700' },
  subtitle: { color: colors.textMuted, fontSize: type.body, lineHeight: 22 },
  message: { fontSize: type.small },
  danger: { color: colors.danger },
  success: { color: colors.success },
});
