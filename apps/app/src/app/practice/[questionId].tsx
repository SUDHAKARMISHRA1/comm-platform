import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import type { SubmitCodeResponse, ExecutionResult, LanguageKey, RunTestsResponse } from '@comm-platform/coding';
import { LANGUAGES } from '@comm-platform/coding';
import { colors, radius, space, type } from '@comm-platform/ui';

import { AppShell } from '@/components/app-shell';
import { ResultDialog } from '@/components/result-dialog';
import { runCode, runTests, submitCode } from '@/coding/api/executionApi';
import { submitToastCopy } from '@/lib/notifications';
import { fetchQuestion } from '@/coding/api/questionApi';
import { CodeEditor } from '@/coding/components/CodeEditor';
import { ConsolePanel } from '@/coding/components/ConsolePanel';
import { DifficultyBadge } from '@/coding/components/DifficultyBadge';
import { MarkdownView } from '@/coding/components/MarkdownView';
import { VoteButton } from '@/coding/components/VoteButton';
import { useEditorDraft } from '@/coding/hooks/useEditorDraft';
import { ApiError } from '@/coding/api/client';
import { useAuth } from '@/providers/auth-provider';

export default function QuestionDetailScreen() {
  const queryClient = useQueryClient();
  const { session, loading: authLoading } = useAuth();
  const { questionId } = useLocalSearchParams<{ questionId: string }>();
  const id = Number(questionId);
  const { width } = useWindowDimensions();
  const isWide = width >= 960;

  const { data: question, isLoading, error } = useQuery({
    queryKey: ['question', id],
    queryFn: () => fetchQuestion(id),
    enabled: Number.isFinite(id) && Boolean(session) && !authLoading,
  });

  const [language, setLanguage] = useState<LanguageKey>('java');

  useEffect(() => {
    if (!question) return;
    const langs = question.supportedLanguages;
    setLanguage(langs.includes('java') ? 'java' : langs[0] ?? 'java');
  }, [question?.id]);
  const template =
    question?.codeTemplates?.[language] ?? LANGUAGES[language].template;
  const { code, setCode, resetDraft } = useEditorDraft(id, language, template);
  const [customInput, setCustomInput] = useState('');
  const [useCustomInput, setUseCustomInput] = useState(true);
  const [runResult, setRunResult] = useState<ExecutionResult | null>(null);
  const [testResult, setTestResult] = useState<RunTestsResponse | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitCodeResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitToast, setSubmitToast] = useState<{ title: string; body: string; ok: boolean } | null>(null);

  useEffect(() => {
    setRunResult(null);
    setTestResult(null);
    setSubmitResult(null);
  }, [language, id]);

  function invalidateProgress() {
    void queryClient.invalidateQueries({ queryKey: ['question', id] });
    void queryClient.invalidateQueries({ queryKey: ['questions'] });
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    void queryClient.invalidateQueries({ queryKey: ['submissions'] });
  }

  function clearConsole() {
    setRunResult(null);
    setTestResult(null);
    setSubmitResult(null);
    setApiError(null);
    setCustomInput('');
  }

  const runMutation = useMutation({
    mutationFn: () =>
      runCode({
        language,
        sourceCode: code,
        stdin: useCustomInput ? customInput : question?.examples[0]?.input ?? '',
        questionId: id,
      }),
    onMutate: () => {
      setApiError(null);
      setSubmitResult(null);
      setTestResult(null);
    },
    onSuccess: (result) => {
      setRunResult(result);
      invalidateProgress();
    },
    onError: (e) => setApiError(e instanceof ApiError ? e.message : 'Run failed'),
  });

  const testsMutation = useMutation({
    mutationFn: () => runTests({ questionId: id, language, sourceCode: code }),
    onMutate: () => {
      setApiError(null);
      setRunResult(null);
      setSubmitResult(null);
    },
    onSuccess: (result) => {
      setTestResult(result);
      invalidateProgress();
    },
    onError: (e) => setApiError(e instanceof ApiError ? e.message : 'Test run failed'),
  });

  const submitMutation = useMutation({
    mutationFn: () => submitCode({ questionId: id, language, sourceCode: code }),
    onMutate: () => {
      setApiError(null);
      setRunResult(null);
      setTestResult(null);
    },
    onSuccess: (result) => {
      setSubmitResult(result);
      setSubmitToast(submitToastCopy(result.status, result.passedTestCases, result.totalTestCases));
      invalidateProgress();
    },
    onError: (e) => {
      const message = e instanceof ApiError ? e.message : 'Submit failed';
      setApiError(message);
      setSubmitToast(submitToastCopy('INTERNAL_ERROR', 0, 0, message));
    },
  });

  const pending = runMutation.isPending || testsMutation.isPending || submitMutation.isPending;

  if (!Number.isFinite(id)) {
    return (
      <AppShell>
        <View style={styles.center}><Text style={styles.error}>Invalid question ID.</Text></View>
      </AppShell>
    );
  }

  if (isLoading) {
    return (
      <AppShell>
        <View style={styles.center}><ActivityIndicator color={colors.primary} /><Text style={styles.muted}>Loading question...</Text></View>
      </AppShell>
    );
  }

  if (error || !question) {
    return (
      <AppShell>
        <View style={styles.center}><Text style={styles.error}>Question not found.</Text><Link href="/practice" asChild><Pressable><Text style={styles.link}>Back to Practice</Text></Pressable></Link></View>
      </AppShell>
    );
  }

  const problemPanel = (
    <ScrollView style={styles.problem} contentContainerStyle={styles.problemContent}>
      <View style={styles.problemHeader}>
        <Text style={styles.problemTitle}>{question.title}</Text>
        <DifficultyBadge difficulty={question.difficulty} />
        <VoteButton questionId={question.id} voteCount={question.voteCount} votedByMe={question.votedByMe} />
      </View>
      <MarkdownView content={question.description} />
      <Text style={styles.section}>Input Format</Text>
      <MarkdownView content={question.inputFormat} />
      <Text style={styles.section}>Output Format</Text>
      <MarkdownView content={question.outputFormat} />
      <Text style={styles.section}>Constraints</Text>
      <MarkdownView content={question.constraints} />
      <Text style={styles.section}>Examples</Text>
      {question.examples.map((ex, i) => (
        <View key={i} style={styles.example}>
          <Text style={styles.mono}>Input: {ex.input}</Text>
          <Text style={styles.mono}>Output: {ex.output}</Text>
          {ex.explanation ? <Text style={styles.muted}>{ex.explanation}</Text> : null}
        </View>
      ))}
      <Text style={styles.section}>Tags</Text>
      <Text style={styles.muted}>{question.topics.join(' · ')}</Text>
    </ScrollView>
  );

  const editorPanel = (
    <View style={styles.editorCol}>
      <View style={styles.langRow}>
        <Text style={styles.langLabel}>Language</Text>
        {Platform.OS === 'web' ? (
          <select
            aria-label="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageKey)}
            style={{
              height: 36,
              minWidth: 140,
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              background: '#ffffff',
              color: '#111827',
              padding: '0 10px',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            {question.supportedLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {LANGUAGES[lang].label}
              </option>
            ))}
          </select>
        ) : (
          <View style={styles.nativeSelect}>
            {question.supportedLanguages.map((lang) => (
              <Pressable
                key={lang}
                onPress={() => setLanguage(lang)}
                style={[styles.langBtn, language === lang && styles.langBtnActive]}
              >
                <Text style={[styles.langBtnText, language === lang && styles.langBtnTextActive]}>
                  {LANGUAGES[lang].label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
        <Pressable onPress={resetDraft} style={styles.resetBtn}><Text style={styles.resetText}>Reset</Text></Pressable>
      </View>
      <CodeEditor language={language} value={code} onChange={setCode} onRun={() => runMutation.mutate()} />
      <Pressable
        onPress={() => setUseCustomInput((v) => !v)}
        style={styles.customToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: useCustomInput }}
      >
        <Text style={styles.customToggleText}>{useCustomInput ? '☑' : '☐'} Use custom input with Run Code</Text>
      </Pressable>
      {useCustomInput ? (
        <View style={styles.customInput}>
          <TextInput
            multiline
            value={customInput}
            onChangeText={setCustomInput}
            placeholder="Enter custom input for Run Code"
            placeholderTextColor={colors.textMuted}
            style={styles.inputArea}
            autoCapitalize="none"
            autoCorrect={false}
            textAlignVertical="top"
          />
        </View>
      ) : null}
      <View style={styles.actions}>
        <Pressable disabled={pending} onPress={() => runMutation.mutate()} style={[styles.btn, styles.btnSecondary]}>
          <Text style={styles.btnSecondaryText}>{runMutation.isPending ? 'Running...' : 'Run Code'}</Text>
        </Pressable>
        <Pressable disabled={pending} onPress={() => testsMutation.mutate()} style={[styles.btn, styles.btnSecondary]}>
          <Text style={styles.btnSecondaryText}>{testsMutation.isPending ? 'Testing...' : 'Run Tests'}</Text>
        </Pressable>
        <Pressable disabled={pending} onPress={() => submitMutation.mutate()} style={[styles.btn, styles.btnPrimary]}>
          <Text style={styles.btnPrimaryText}>{submitMutation.isPending ? 'Submitting...' : 'Submit Code'}</Text>
        </Pressable>
      </View>
      {apiError ? <Text style={styles.error}>{apiError}</Text> : null}
      <ConsolePanel
        runResult={runResult}
        testResult={testResult}
        submitResult={submitResult}
        customInput={customInput}
        onCustomInputChange={setCustomInput}
        onClear={clearConsole}
        loading={pending}
      />
    </View>
  );

  return (
    <AppShell>
      <View style={styles.nav}>
        <Link href="/practice" asChild><Pressable><Text style={styles.link}>← Back to Practice</Text></Pressable></Link>
        <View style={styles.navBtns}>
          {question.navigation.prev ? (
            <Pressable onPress={() => router.push(`/practice/${question.navigation.prev}`)}>
              <Text style={styles.link}>← Previous</Text>
            </Pressable>
          ) : null}
          {question.navigation.next ? (
            <Pressable onPress={() => router.push(`/practice/${question.navigation.next}`)}>
              <Text style={styles.link}>Next →</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
      <View style={[styles.workspace, isWide ? styles.workspaceRow : styles.workspaceCol]}>
        {problemPanel}
        {editorPanel}
      </View>
      <ResultDialog
        visible={Boolean(submitToast)}
        title={submitToast?.title ?? ''}
        body={submitToast?.body ?? ''}
        ok={submitToast?.ok ?? false}
        onClose={() => setSubmitToast(null)}
      />
    </AppShell>
  );
}

const mono = Platform.OS === 'web' ? ({ fontFamily: 'monospace' } as const) : {};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md, padding: space.lg },
  nav: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: space.lg, paddingVertical: space.sm, borderBottomWidth: 1, borderColor: colors.border },
  navBtns: { flexDirection: 'row', gap: space.md },
  workspace: { flex: 1, minHeight: 500 },
  workspaceRow: { flexDirection: 'row' },
  workspaceCol: { flexDirection: 'column' },
  problem: { flex: 1, borderRightWidth: 1, borderColor: colors.border },
  problemContent: { padding: space.lg, gap: space.md },
  problemHeader: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  problemTitle: { fontSize: 22, fontWeight: '700', color: colors.text },
  section: { fontSize: type.body, fontWeight: '700', color: colors.text, marginTop: space.sm },
  example: { backgroundColor: colors.surfaceMuted, padding: space.md, borderRadius: radius.md, gap: space.xs },
  mono: { fontSize: type.small, color: colors.text, ...mono },
  muted: { color: colors.textMuted, fontSize: type.small },
  error: { color: colors.danger },
  link: { color: colors.primary, fontWeight: '600' },
  editorCol: { flex: 1, padding: space.md, gap: space.sm },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  langLabel: { fontSize: type.small, color: colors.textMuted, fontWeight: '600' },
  nativeSelect: { flexDirection: 'row', gap: space.xs, flexWrap: 'wrap' },
  langBtn: { paddingHorizontal: space.sm, paddingVertical: 4, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border },
  langBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  langBtnText: { fontSize: type.small, color: colors.text },
  langBtnTextActive: { color: colors.primaryText, fontWeight: '700' },
  resetBtn: { marginLeft: 'auto' as never },
  resetText: { fontSize: type.small, color: colors.primary, fontWeight: '600' },
  customInput: { gap: space.xs },
  customToggle: { paddingVertical: space.xs },
  customToggleText: { fontSize: type.small, color: colors.text, fontWeight: '600' },
  inputArea: { minHeight: 72, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space.sm, backgroundColor: colors.surface, color: colors.text, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', gap: space.sm },
  btn: { flex: 1, paddingVertical: space.sm + 2, borderRadius: radius.md, alignItems: 'center' },
  btnPrimary: { backgroundColor: colors.primary },
  btnPrimaryText: { color: colors.primaryText, fontWeight: '700' },
  btnSecondary: { backgroundColor: colors.primary, borderWidth: 1, borderColor: colors.primary },
  btnSecondaryText: { color: colors.primaryText, fontWeight: '700' },
});
