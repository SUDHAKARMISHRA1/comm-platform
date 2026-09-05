import { createElement, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';
import type { LanguageKey } from '@comm-platform/coding';
import { LANGUAGES } from '@comm-platform/coding';

import { loadMonaco } from './loadMonaco';
import { setupMonacoLanguages } from './monacoLanguages';

type Props = {
  language: LanguageKey;
  value: string;
  onChange: (v: string) => void;
  onRun?: () => void;
};

type MonacoEditor = {
  getValue: () => string;
  setValue: (v: string) => void;
  getModel: () => { uri: unknown } | null;
  updateOptions: (opts: object) => void;
  addCommand: (keybinding: number, handler: () => void) => void;
  layout: () => void;
  dispose: () => void;
  onDidChangeModelContent: (cb: () => void) => { dispose: () => void };
};

export function CodeEditor({ language, value, onChange, onRun }: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<MonacoEditor | null>(null);
  const monacoRef = useRef<Awaited<ReturnType<typeof loadMonaco>> | null>(null);
  const onRunRef = useRef(onRun);
  const onChangeRef = useRef(onChange);
  onRunRef.current = onRun;
  onChangeRef.current = onChange;

  useEffect(() => {
    let disposed = false;
    let contentSub: { dispose: () => void } | null = null;

    loadMonaco()
      .then((monaco) => {
        if (disposed || !hostRef.current) return;
        setupMonacoLanguages(monaco as never);
        monacoRef.current = monaco;
        monaco.editor.setTheme('comm-light');
        const editor = monaco.editor.create(hostRef.current, {
          value,
          language: LANGUAGES[language].monacoLanguage,
          theme: 'comm-light',
          fontSize: 14,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          quickSuggestions: { other: true, comments: false, strings: false },
          suggestOnTriggerCharacters: true,
          snippetSuggestions: 'inline',
          wordBasedSuggestions: 'currentDocument',
          parameterHints: { enabled: true },
          suggest: { preview: true, showKeywords: true, showSnippets: true },
          padding: { top: 8 },
        }) as unknown as MonacoEditor;
        editorRef.current = editor;
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRunRef.current?.());
        contentSub = editor.onDidChangeModelContent(() => {
          onChangeRef.current(editor.getValue());
        });
        setReady(true);
        requestAnimationFrame(() => editor.layout());
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });

    return () => {
      disposed = true;
      contentSub?.dispose();
      editorRef.current?.dispose();
      editorRef.current = null;
    };
    // Create once; language/value sync happens in the effects below.
  }, []);

  useEffect(() => {
    const monaco = monacoRef.current;
    const editor = editorRef.current;
    const model = editor?.getModel();
    if (!monaco || !model) return;
    monaco.editor.setModelLanguage(model as never, LANGUAGES[language].monacoLanguage);
  }, [language]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (editor.getValue() !== value) editor.setValue(value);
  }, [value]);

  useEffect(() => {
    editorRef.current?.layout();
  }, [fullscreen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        setFullscreen((f) => !f);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <View style={[styles.wrap, fullscreen && styles.fullscreen]}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarText}>{LANGUAGES[language].label} editor</Text>
        <View style={styles.toolbarActions}>
          <Pressable onPress={() => setFullscreen((f) => !f)} style={styles.toolBtn}>
            <Text style={styles.toolBtnText}>{fullscreen ? 'Exit FS' : 'Fullscreen'}</Text>
          </Pressable>
        </View>
      </View>
      {failed ? (
        <TextInput
          multiline
          value={value}
          onChangeText={onChange}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          textAlignVertical="top"
          style={styles.textarea}
          accessibilityLabel="Source code editor"
        />
      ) : (
        <View style={[styles.editorHost, fullscreen && styles.editorHostFs]} collapsable={false}>
          {!ready ? (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.toolbarText}>Loading editor…</Text>
            </View>
          ) : null}
          {createElement('div', {
            ref: hostRef,
            style: { height: '100%', width: '100%', minHeight: 280 },
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { minHeight: 320, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.surface },
  fullscreen: { position: 'fixed' as never, top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, minHeight: '100%' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.sm, paddingVertical: space.xs, backgroundColor: colors.surfaceMuted, borderBottomWidth: 1, borderColor: colors.border },
  toolbarText: { fontSize: type.small, fontWeight: '600', color: colors.textMuted },
  toolbarActions: { flexDirection: 'row', gap: space.xs },
  toolBtn: { paddingHorizontal: space.sm, paddingVertical: 4, borderRadius: radius.sm, backgroundColor: colors.surface },
  toolBtnText: { fontSize: 12, color: colors.text, fontWeight: '600' },
  editorHost: { height: 320, width: '100%', backgroundColor: colors.surface, position: 'relative' as const },
  editorHostFs: { flex: 1, height: '100%' as never, minHeight: 400 },
  loading: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: space.sm, zIndex: 1 },
  textarea: {
    minHeight: 280,
    padding: space.md,
    fontSize: 14,
    color: colors.text,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
});
