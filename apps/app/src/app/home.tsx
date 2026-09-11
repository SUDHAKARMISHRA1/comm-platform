import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

import { AppShell } from '@/components/app-shell';

const highlights = [
  {
    title: 'Original Java, C, and C++ sets',
    description: 'Work through Easy, Medium, and Hard problems with stdin/stdout tests instead of leftover interview dumps.',
  },
  {
    title: 'Run tests as you go',
    description: 'Write a solution, submit it, and see which cases pass without leaving the practice workspace.',
  },
  {
    title: 'Made for every screen',
    description: 'Start in your browser and continue on mobile when the app launches on Android and iOS.',
  },
];

const activity = [
  { initial: 'M', name: 'Maya Chen', detail: 'Solved Two Sum in the Java pack', time: 'Just now' },
  { initial: 'R', name: 'Rohan Patel', detail: 'Passed tests on a C medium problem', time: '18 min ago' },
  { initial: 'A', name: 'Amelia Ross', detail: 'Started the C++ practice path', time: '1 hr ago' },
];

export default function HomeScreen() {
  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.badge}>Practice with structure</Text>
          <Text accessibilityRole="header" style={styles.title}>
            Coding practice for Java, C, and C++.
          </Text>
          <Text style={styles.body}>
            Work through Easy, Medium, and Hard problems, run tests, and track what you have solved.
          </Text>
          <View style={styles.actions}>
            <Link href="/signup" asChild>
              <Pressable style={styles.primaryAction}>
                <Text style={styles.primaryActionText}>Create your account</Text>
              </Pressable>
            </Link>
            <Link href="/login" asChild>
              <Pressable style={styles.secondaryAction}>
                <Text style={styles.secondaryActionText}>Sign in</Text>
              </Pressable>
            </Link>
          </View>
          <Text style={styles.muted}>Start with Java, C, or C++. Contests and more languages come later.</Text>
        </View>

        <View style={styles.preview}>
          <Text style={styles.previewKicker}>Your practice</Text>
          <Text style={styles.previewTitle}>Good morning</Text>
          <View style={styles.workspaceCard}>
            <View style={styles.workspaceRow}>
              <View>
                <Text style={styles.workspaceName}>Java practice path</Text>
                <Text style={styles.muted}>38 problems · Easy to Hard</Text>
              </View>
              <Text style={styles.live}>Live</Text>
            </View>
          </View>
          {activity.map((item) => (
            <View key={item.name} style={styles.activityRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.initial}</Text>
              </View>
              <View style={styles.activityCopy}>
                <Text style={styles.activityName}>{item.name}</Text>
                <Text style={styles.muted}>{item.detail}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionKicker}>What you get</Text>
        <Text style={styles.sectionTitle}>A practice path built around progress.</Text>
        <View style={styles.cards}>
          {highlights.map((item, index) => (
            <View key={item.title} style={styles.card}>
              <Text style={styles.cardIndex}>0{index + 1}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.body}>{item.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.lg, gap: space.lg, paddingBottom: space.xl },
  hero: { gap: space.md, maxWidth: 720 },
  badge: { color: colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 12 },
  title: { color: colors.text, fontSize: type.title, fontWeight: '700', lineHeight: 36 },
  body: { color: colors.textMuted, fontSize: type.body, lineHeight: 24 },
  muted: { color: colors.textMuted, fontSize: type.small },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  primaryAction: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: space.sm + 4 },
  primaryActionText: { color: colors.primaryText, fontWeight: '700' },
  secondaryAction: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: space.sm + 4 },
  secondaryActionText: { color: colors.primaryText, fontWeight: '700' },
  preview: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: space.md, gap: space.sm },
  previewKicker: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  previewTitle: { color: colors.text, fontSize: type.body, fontWeight: '700' },
  workspaceCard: { backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: space.md },
  workspaceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  workspaceName: { color: colors.text, fontWeight: '700' },
  live: { color: colors.success, fontWeight: '700', fontSize: type.small },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '700', color: colors.text, fontSize: type.small },
  activityCopy: { flex: 1 },
  activityName: { color: colors.text, fontWeight: '600' },
  time: { color: colors.textMuted, fontSize: 11 },
  sectionKicker: { color: colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  sectionTitle: { color: colors.text, fontSize: 22, fontWeight: '700' },
  cards: { gap: space.md },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space.md, gap: space.sm },
  cardIndex: { color: colors.primary, fontWeight: '700' },
  cardTitle: { color: colors.text, fontSize: type.body, fontWeight: '700' },
});
