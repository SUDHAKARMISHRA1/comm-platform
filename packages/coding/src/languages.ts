import type { LanguageKey } from './types';

export type LanguageConfig = {
  key: LanguageKey;
  label: string;
  extension: string;
  monacoLanguage: string;
  /** Backend-only Judge0 language ID — never send to frontend consumers */
  judge0LanguageId: number;
  template: string;
};

export const LANGUAGES: Record<LanguageKey, LanguageConfig> = {
  java: {
    key: 'java',
    label: 'Java',
    extension: 'java',
    monacoLanguage: 'java',
    judge0LanguageId: 62,
    template: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        
    }
}`,
  },
  c: {
    key: 'c',
    label: 'C',
    extension: 'c',
    monacoLanguage: 'c',
    judge0LanguageId: 50,
    template: `#include <stdio.h>

int main() {
    return 0;
}`,
  },
  cpp: {
    key: 'cpp',
    label: 'C++',
    extension: 'cpp',
    monacoLanguage: 'cpp',
    judge0LanguageId: 54,
    template: `#include <bits/stdc++.h>
using namespace std;

int main() {
    return 0;
}`,
  },
};

export const LANGUAGE_LIST = Object.values(LANGUAGES);

export function getLanguage(key: LanguageKey): LanguageConfig {
  return LANGUAGES[key];
}

export function getJudge0LanguageId(key: LanguageKey): number {
  return LANGUAGES[key].judge0LanguageId;
}
