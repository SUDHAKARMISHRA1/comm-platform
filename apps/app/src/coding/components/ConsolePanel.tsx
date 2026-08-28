import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';
import type { ExecutionResult, ExecutionStatus } from '@comm-platform/coding';

const STATUS_LABELS: Record<ExecutionStatus, string> = {
  QUEUED: 'Queued',
  RUNNING: 'Running',
  ACCEPTED: '✓ Accepted',
  WRONG_ANSWER: '✕ Wrong Answer',
  COMPILATION_ERROR: 'Compilation Error',
  RUNTIME_ERROR: 'Runtime Error',
  TIME_LIMIT_EXCEEDED: 'Time Limit Exceeded',
  MEMORY_LIMIT_EXCEEDED: 'Memory Limit Exceeded',
  INTERNAL_ERROR: 'Internal Error',
};

type Tab = 'result' | 'output' | 'error' | 'input';

type Props = {
  runResult?: ExecutionResult | null;
  submitResult?: {
    status: ExecutionStatus;
    passedTestCases: number;
    totalTestCases: number;
    executionTime: string;
    memory: string;
    testCaseResults?: { index: number; passed: boolean; hidden: boolean }[];
  } | null;
  customInput: string;
  loading?: boolean;
};

export function ConsolePanel({ runResult, submitResult, customInput, loading }: Props) {
  const [tab, setTab] = useState<Tab>('result');
  const [collapsed, setCollapsed] = useState(false);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'result', label: 'Test Result' },
    { key: 'output', label: 'Output' },
    { key: 'error', label: 'Error' },
    { key: 'input', label: 'Input' },
  ];

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={styles.tabs}>
          {tabs.map((t) => (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={[styles.tab, tab === t.key && styles.tabActive]}>
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={() => setCollapsed((c) => !c)}>
          <Text style={styles.collapse}>{collapsed ? 'Expand' : 'Collapse'}</Text>
        </Pressable>
      </View>
      {!collapsed ? (
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          {loading ? <Text style={styles.muted}>⟳ Running code...</Text> : null}
          {tab === 'input' ? <Text style={styles.mono}>{customInput || 'No custom input'}</Text> : null}
          {tab === 'output' && runResult ? (
            <Text style={styles.mono}>{runResult.stdout || '—'}</Text>
          ) : null}
          {tab === 'error' && runResult ? (
            <Text style={[styles.mono, styles.error]}>
              {runResult.compileOutput || runResult.stderr || '—'}
            </Text>
          ) : null}
          {tab === 'result' ? (
            <>
              {submitResult ? (
                <View style={styles.block}>
                  <Text style={[styles.status, submitResult.status === 'ACCEPTED' ? styles.ok : styles.bad]}>
                    {STATUS_LABELS[submitResult.status]}
                  </Text>
                  <Text style={styles.meta}>
                    {submitResult.passedTestCases} / {submitResult.totalTestCases} Test Cases Passed
                  </Text>
                  <Text style={styles.meta}>Runtime: {submitResult.executionTime} · Memory: {submitResult.memory}</Text>
                  {submitResult.testCaseResults?.map((tc) => (
                    <Text key={tc.index} style={tc.passed ? styles.ok : styles.bad}>
                      {tc.passed ? '✓' : '✕'} Test Case {tc.index}
                      {!tc.passed && tc.hidden ? ' — Expected output does not match.' : ''}
                    </Text>
                  ))}
                </View>
              ) : null}
              {runResult ? (
                <View style={styles.block}>
                  <Text style={styles.meta}>Status: {STATUS_LABELS[runResult.status]}</Text>
                  <Text style={styles.meta}>Execution Time: {runResult.executionTime.toFixed(2)} sec</Text>
                  <Text style={styles.meta}>Memory: {(runResult.memory / 1024).toFixed(0)} KB</Text>
                </View>
              ) : null}
              {!runResult && !submitResult && !loading ? (
                <Text style={styles.muted}>Run or submit code to see results.</Text>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface, minHeight: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.border, paddingHorizontal: space.sm },
  tabs: { flexDirection: 'row', flexWrap: 'wrap' },
  tab: { paddingHorizontal: space.sm, paddingVertical: space.sm },
  tabActive: { borderBottomWidth: 2, borderColor: colors.primary },
  tabText: { fontSize: type.small, color: colors.textMuted },
  tabTextActive: { color: colors.primary, fontWeight: '700' },
  collapse: { fontSize: type.small, color: colors.primary, fontWeight: '600', padding: space.sm },
  body: { maxHeight: 220 },
  bodyContent: { padding: space.md, gap: space.sm },
  mono: { fontFamily: Platform.OS === 'web' ? 'monospace' : undefined, fontSize: type.small, color: colors.text },
  muted: { color: colors.textMuted, fontSize: type.small },
  block: { gap: space.xs },
  status: { fontSize: type.body, fontWeight: '700' },
  meta: { fontSize: type.small, color: colors.textMuted },
  ok: { color: colors.success, fontSize: type.small },
  bad: { color: colors.danger, fontSize: type.small },
  error: { color: colors.danger },
});
