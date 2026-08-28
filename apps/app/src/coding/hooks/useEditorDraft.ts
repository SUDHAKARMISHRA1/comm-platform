import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import type { LanguageKey } from '@comm-platform/coding';

import { getWebStorageItem, removeWebStorageItem, setWebStorageItem } from '@/lib/safe-web-storage';

const prefix = 'coding-draft:';

function storageKey(questionId: number, language: LanguageKey) {
  return `${prefix}${questionId}:${language}`;
}

export function useEditorDraft(questionId: number, language: LanguageKey, defaultCode: string) {
  const [code, setCode] = useState(defaultCode);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      setCode(defaultCode);
      return;
    }
    const saved = getWebStorageItem(storageKey(questionId, language));
    setCode(saved ?? defaultCode);
    setRestored(Boolean(saved));
  }, [questionId, language, defaultCode]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    setWebStorageItem(storageKey(questionId, language), code);
  }, [code, questionId, language]);

  function resetDraft() {
    setCode(defaultCode);
    if (Platform.OS === 'web') {
      removeWebStorageItem(storageKey(questionId, language));
    }
    setRestored(false);
  }

  return { code, setCode, resetDraft, restored };
}
