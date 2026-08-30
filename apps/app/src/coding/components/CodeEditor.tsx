import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';
import type { LanguageKey } from '@comm-platform/coding';
import { LANGUAGES } from '@comm-platform/coding';
import { useEffect, useState } from 'react';

type Props = {
  language: LanguageKey;
  value: string;
  onChange: (v: string) => void;
  onRun?: () => void;
};

export function CodeEditor({ language, value, onChange, onRun }: Props) {
  const [fullscreen, setFullscreen] = useState(false);

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
  textarea: {
    minHeight: 280,
    flex: 1,
    padding: space.md,
    fontSize: 14,
    color: colors.text,
    fontFamily: Platform.OS === 'web' ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' : undefined,
  },
});
