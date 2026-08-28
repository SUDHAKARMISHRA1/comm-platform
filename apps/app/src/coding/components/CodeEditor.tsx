import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';
import type { LanguageKey } from '@comm-platform/coding';
import { LANGUAGES } from '@comm-platform/coding';

type Props = {
  language: LanguageKey;
  value: string;
  onChange: (v: string) => void;
  onRun?: () => void;
  theme?: 'light' | 'dark';
  fontSize?: number;
};

export function CodeEditor({ language, value, onChange, onRun, theme = 'light', fontSize = 14 }: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onRun?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
      }
      if (e.key === 'F11') {
        e.preventDefault();
        setFullscreen((f) => !f);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onRun]);

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Code editor is available on web.</Text>
      </View>
    );
  }

  const Editor = require('@monaco-editor/react').default;
  const monacoLang = LANGUAGES[language].monacoLanguage;

  return (
    <View style={[styles.wrap, fullscreen && styles.fullscreen]}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarText}>Editor</Text>
        <View style={styles.toolbarActions}>
          <Pressable onPress={() => setFullscreen((f) => !f)} style={styles.toolBtn}>
            <Text style={styles.toolBtnText}>{fullscreen ? 'Exit FS' : 'Fullscreen'}</Text>
          </Pressable>
        </View>
      </View>
      <View ref={containerRef as never} style={styles.editor}>
        <Editor
          height="100%"
          language={monacoLang}
          value={value}
          onChange={(v: string | undefined) => onChange(v ?? '')}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            fontSize,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, minHeight: 320, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, overflow: 'hidden' },
  fullscreen: { position: 'fixed' as never, top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, minHeight: '100%' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.sm, paddingVertical: space.xs, backgroundColor: colors.surfaceMuted, borderBottomWidth: 1, borderColor: colors.border },
  toolbarText: { fontSize: type.small, fontWeight: '600', color: colors.textMuted },
  toolbarActions: { flexDirection: 'row', gap: space.xs },
  toolBtn: { paddingHorizontal: space.sm, paddingVertical: 4, borderRadius: radius.sm, backgroundColor: colors.surface },
  toolBtnText: { fontSize: 12, color: colors.text, fontWeight: '600' },
  editor: { flex: 1, minHeight: 280 },
  fallback: { padding: space.lg, backgroundColor: colors.surfaceMuted, borderRadius: radius.md },
  fallbackText: { color: colors.textMuted },
});
