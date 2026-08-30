import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';
import type { ExecutionResult, ExecutionStatus, RunTestsResponse, SubmitCodeResponse } from '@comm-platform/coding';

import { submissionTone } from '@/coding/statusColors';

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
  submitResult?: SubmitCodeResponse | null;
  testResult?: RunTestsResponse | null;
  customInput: string;
  onCustomInputChange: (value: string) => void;
  onClear: () => void;
  loading?: boolean;
};

export function ConsolePanel({
  runResult,
  submitResult,
  testResult,
  customInput,
  onCustomInputChange,
  onClear,
  loading,
}: Props) {
  const [tab, setTab] = useState<Tab>('result');
  const [collapsed, setCollapsed] = useState(false);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'result', label: 'Test Result' },
    { key: 'output', label: 'Output' },
    { key: 'error', label: 'Error' },
    { key: 'input', label: 'Input' },
  ];

  const stdout = runResult?.stdout || testResult?.stdout || '';
  const stderr = runResult?.compileOutput || runResult?.stderr || testResult?.compileOutput || testResult?.stderr || '';
  const verdict = submitResult ?? testResult;

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
        <View style={styles.headerActions}>
          <Pressable onPress={onClear} accessibilityRole="button">
            <Text style={styles.collapse}>Clear</Text>
          </Pressable>
          <Pressable onPress={() => setCollapsed((c) => !c)}>
            <Text style={styles.collapse}>{collapsed ? 'Expand' : 'Collapse'}</Text>
          </Pressable>
        </View>
      </View>
      {!collapsed ? (
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          {loading ? <Text style={styles.muted}>⟳ Running code...</Text> : null}
          {tab === 'input' ? (
            <TextInput
              multiline
              value={customInput}
              onChangeText={onCustomInputChange}
              placeholder="Enter custom input for Run Code"
              placeholderTextColor={colors.textMuted}
              style={styles.inputArea}
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />
          ) : null}
          {tab === 'output' ? (
            <Text style={styles.mono}>
              {loading
                ? ''
                : stdout ||
                  submitResult?.testCaseResults?.find((tc) => !tc.hidden && tc.stdout)?.stdout ||
                  'No output yet.'}
            </Text>
          ) : null}
          {tab === 'error' ? (
            <Text style={[styles.mono, stderr ? styles.error : undefined]}>
              {loading ? '' : stderr || 'No errors.'}
            </Text>
          ) : null}
          {tab === 'result' ? (
            <>
              {verdict ? (
                <View style={styles.block}>
                  <Text
                    style={[
                      styles.status,
                      submissionTone(verdict.status) === 'ok'
                        ? styles.ok
                        : submissionTone(verdict.status) === 'pending'
                          ? styles.pending
                          : styles.bad,
                    ]}
                  >
                    {STATUS_LABELS[verdict.status]}
                  </Text>
                  <Text style={styles.meta}>
                    {verdict.passedTestCases} / {verdict.totalTestCases} Test Cases Passed
                  </Text>
                  <Text style={styles.meta}>Runtime: {verdict.executionTime} · Memory: {verdict.memory}</Text>
                  {verdict.testCaseResults?.map((tc) => (
                    <View key={tc.index} style={styles.case}>
                      <Text style={tc.passed ? styles.ok : styles.bad}>
                        {tc.passed ? '✓' : '✕'} Test Case {tc.index}
                        {tc.hidden ? ' (hidden)' : ''}
                        {!tc.passed && !tc.hidden ? ' — output does not match expected.' : ''}
                      </Text>
                      {!tc.hidden && tc.stdout != null && tc.stdout !== '' ? (
                        <Text style={styles.mono}>Your output: {tc.stdout}</Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              ) : null}
              {runResult ? (
                <View style={styles.block}>
                  <Text style={styles.meta}>
                    Custom run status:{' '}
                    <Text
                      style={
                        submissionTone(runResult.status) === 'ok'
                          ? styles.ok
                          : submissionTone(runResult.status) === 'pending'
                            ? styles.pending
                            : styles.bad
                      }
                    >
                      {STATUS_LABELS[runResult.status]}
                    </Text>
                  </Text>
                  <Text style={styles.meta}>Execution Time: {runResult.executionTime.toFixed(2)} sec</Text>
                  <Text style={styles.meta}>Memory: {Math.max(0, runResult.memory).toFixed(0)} KB</Text>
                </View>
              ) : null}
              {!runResult && !verdict && !loading ? (
                <Text style={styles.muted}>Run code, run tests, or submit to see results.</Text>
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
  tabs: { flexDirection: 'row', flexWrap: 'wrap', flex: 1 },
  tab: { paddingHorizontal: space.sm, paddingVertical: space.sm },
  tabActive: { borderBottomWidth: 2, borderColor: colors.primary },
  tabText: { fontSize: type.small, color: colors.textMuted },
  tabTextActive: { color: colors.primary, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  collapse: { fontSize: type.small, color: colors.primary, fontWeight: '600', padding: space.sm },
  body: { maxHeight: 260 },
  bodyContent: { padding: space.md, gap: space.sm },
  mono: { fontFamily: Platform.OS === 'web' ? 'monospace' : undefined, fontSize: type.small, color: colors.text },
  muted: { color: colors.textMuted, fontSize: type.small },
  block: { gap: space.xs },
  case: { gap: 2 },
  status: { fontSize: type.body, fontWeight: '700' },
  meta: { fontSize: type.small, color: colors.textMuted },
  ok: { color: colors.success, fontSize: type.small },
  pending: { color: colors.warning, fontSize: type.small },
  bad: { color: colors.danger, fontSize: type.small },
  error: { color: colors.danger },
  inputArea: { minHeight: 88, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space.sm, backgroundColor: colors.surfaceMuted, color: colors.text, textAlignVertical: 'top' },
});
