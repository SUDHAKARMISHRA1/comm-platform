import { useMutation, useQuery } from '@tanstack/react-query';
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

import type { SubmitCodeResponse, ExecutionResult, LanguageKey } from '@comm-platform/coding';
import { LANGUAGES } from '@comm-platform/coding';
import { colors, radius, space, type } from '@comm-platform/ui';

import { AppShell } from '@/components/app-shell';
import { runCode, submitCode } from '@/coding/api/executionApi';
import { fetchQuestion } from '@/coding/api/questionApi';
import { CodeEditor } from '@/coding/components/CodeEditor';
import { ConsolePanel } from '@/coding/components/ConsolePanel';
import { DifficultyBadge } from '@/coding/components/DifficultyBadge';
import { MarkdownView } from '@/coding/components/MarkdownView';
import { useEditorDraft } from '@/coding/hooks/useEditorDraft';
import { ApiError } from '@/coding/api/client';
import { useAuth } from '@/providers/auth-provider';

export default function QuestionDetailScreen() {
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
  const template =
    question?.codeTemplates?.[language] ?? LANGUAGES[language].template;
  const { code, setCode, resetDraft } = useEditorDraft(id, language, template);
  const [customInput, setCustomInput] = useState('');
  const [runResult, setRunResult] = useState<ExecutionResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitCodeResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    setRunResult(null);
    setSubmitResult(null);
  }, [language, id]);

  const runMutation = useMutation({
    mutationFn: () => runCode({ language, sourceCode: code, stdin: customInput }),
    onMutate: () => { setApiError(null); setSubmitResult(null); },
    onSuccess: setRunResult,
    onError: (e) => setApiError(e instanceof ApiError ? e.message : 'Run failed'),
  });

  const submitMutation = useMutation({
    mutationFn: () => submitCode({ questionId: id, language, sourceCode: code }),
    onMutate: () => { setApiError(null); setRunResult(null); },
    onSuccess: setSubmitResult,
    onError: (e) => setApiError(e instanceof ApiError ? e.message : 'Submit failed'),
  });

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
        <Text style={styles.langLabel}>Language:</Text>
        {(question.supportedLanguages as LanguageKey[]).map((lang) => (
          <Pressable key={lang} onPress={() => setLanguage(lang)} style={[styles.langBtn, language === lang && styles.langBtnActive]}>
            <Text style={[styles.langBtnText, language === lang && styles.langBtnTextActive]}>{LANGUAGES[lang].label}</Text>
          </Pressable>
        ))}
        <Pressable onPress={resetDraft} style={styles.resetBtn}><Text style={styles.resetText}>Reset</Text></Pressable>
      </View>
      <CodeEditor language={language} value={code} onChange={setCode} onRun={() => runMutation.mutate()} />
      <View style={styles.customInput}>
        <Text style={styles.section}>Custom Input</Text>
        <TextInput
          multiline
          value={customInput}
          onChangeText={setCustomInput}
          placeholder="Enter custom input for Run Code"
          placeholderTextColor={colors.textMuted}
          style={styles.inputArea}
        />
        <Pressable onPress={() => setCustomInput('')}><Text style={styles.link}>Clear</Text></Pressable>
      </View>
      <View style={styles.actions}>
        <Pressable
          disabled={runMutation.isPending || submitMutation.isPending}
          onPress={() => runMutation.mutate()}
          style={[styles.btn, styles.btnSecondary]}
        >
          <Text style={styles.btnSecondaryText}>{runMutation.isPending ? 'Running...' : 'Run Code'}</Text>
        </Pressable>
        <Pressable
          disabled={runMutation.isPending || submitMutation.isPending}
          onPress={() => submitMutation.mutate()}
          style={[styles.btn, styles.btnPrimary]}
        >
          <Text style={styles.btnPrimaryText}>{submitMutation.isPending ? 'Submitting...' : 'Submit Code'}</Text>
        </Pressable>
      </View>
      {apiError ? <Text style={styles.error}>{apiError}</Text> : null}
      <ConsolePanel
        runResult={runResult}
        submitResult={submitResult}
        customInput={customInput}
        loading={runMutation.isPending || submitMutation.isPending}
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
  langRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs, flexWrap: 'wrap' },
  langLabel: { fontSize: type.small, color: colors.textMuted, fontWeight: '600' },
  langBtn: { paddingHorizontal: space.sm, paddingVertical: 4, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border },
  langBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  langBtnText: { fontSize: type.small, color: colors.text },
  langBtnTextActive: { color: colors.primaryText, fontWeight: '700' },
  resetBtn: { marginLeft: 'auto' as never },
  resetText: { fontSize: type.small, color: colors.primary, fontWeight: '600' },
  customInput: { gap: space.xs },
  inputArea: { minHeight: 72, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space.sm, backgroundColor: colors.surface, color: colors.text, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', gap: space.sm },
  btn: { flex: 1, paddingVertical: space.sm + 2, borderRadius: radius.md, alignItems: 'center' },
  btnPrimary: { backgroundColor: colors.primary },
  btnPrimaryText: { color: colors.primaryText, fontWeight: '700' },
  btnSecondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  btnSecondaryText: { color: colors.text, fontWeight: '700' },
});
