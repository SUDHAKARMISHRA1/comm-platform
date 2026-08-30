type Monaco = {
  editor: {
    defineTheme: (name: string, theme: Record<string, unknown>) => void;
  };
  languages: {
    registerCompletionItemProvider: (lang: string, provider: object) => void;
    CompletionItemKind: Record<string, number>;
    CompletionItemInsertTextRule: { InsertAsSnippet: number };
  };
};

let registered = false;

type Item = { label: string; insert: string; kind: 'fn' | 'mod' | 'kw' | 'cls' | 'prop'; detail: string };

function rangeAt(model: { getWordUntilPosition: (p: unknown) => { startColumn: number; endColumn: number } }, position: { lineNumber: number }) {
  const word = model.getWordUntilPosition(position);
  return {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn,
  };
}

function suggestions(monaco: Monaco, items: Item[], range: object) {
  const Kind = monaco.languages.CompletionItemKind;
  const kindMap = { fn: Kind.Function, mod: Kind.Module, kw: Kind.Keyword, cls: Kind.Class, prop: Kind.Property };
  return items.map((item) => ({
    label: item.label,
    kind: kindMap[item.kind],
    insertText: item.insert,
    insertTextRules: item.insert.includes('$')
      ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      : undefined,
    detail: item.detail,
    range,
  }));
}

const JAVA_IMPORTS: Item[] = [
  { label: 'java.util.*', insert: 'java.util.*;', kind: 'mod', detail: 'Collections, Scanner, Map' },
  { label: 'java.util.Scanner', insert: 'java.util.Scanner;', kind: 'cls', detail: 'Read stdin' },
  { label: 'java.util.ArrayList', insert: 'java.util.ArrayList;', kind: 'cls', detail: 'Resizable array' },
  { label: 'java.util.HashMap', insert: 'java.util.HashMap;', kind: 'cls', detail: 'Hash table map' },
  { label: 'java.util.HashSet', insert: 'java.util.HashSet;', kind: 'cls', detail: 'Hash table set' },
  { label: 'java.util.Arrays', insert: 'java.util.Arrays;', kind: 'cls', detail: 'Array helpers' },
  { label: 'java.util.Collections', insert: 'java.util.Collections;', kind: 'cls', detail: 'Collection helpers' },
  { label: 'java.io.*', insert: 'java.io.*;', kind: 'mod', detail: 'IO streams' },
  { label: 'java.lang.Math', insert: 'java.lang.Math;', kind: 'cls', detail: 'Math utilities' },
];

const JAVA_TYPES: Item[] = [
  { label: 'Scanner', insert: 'Scanner', kind: 'cls', detail: 'java.util.Scanner' },
  { label: 'ArrayList', insert: 'ArrayList<${1:Integer}>', kind: 'cls', detail: 'java.util.ArrayList' },
  { label: 'HashMap', insert: 'HashMap<${1:Integer}, ${2:Integer}>', kind: 'cls', detail: 'java.util.HashMap' },
  { label: 'HashSet', insert: 'HashSet<${1:Integer}>', kind: 'cls', detail: 'java.util.HashSet' },
  { label: 'StringBuilder', insert: 'StringBuilder', kind: 'cls', detail: 'java.lang.StringBuilder' },
  { label: 'String', insert: 'String', kind: 'cls', detail: 'java.lang.String' },
  { label: 'System.out.println', insert: 'System.out.println(${1});', kind: 'fn', detail: 'Print a line' },
  { label: 'main', insert: 'public static void main(String[] args) {\n    ${1}\n}', kind: 'fn', detail: 'Program entry' },
];

const SYSTEM_DOT: Item[] = [
  { label: 'out', insert: 'out', kind: 'prop', detail: 'PrintStream' },
  { label: 'err', insert: 'err', kind: 'prop', detail: 'PrintStream' },
  { label: 'in', insert: 'in', kind: 'prop', detail: 'InputStream' },
  { label: 'exit', insert: 'exit(${1:0});', kind: 'fn', detail: 'Terminate JVM' },
  { label: 'currentTimeMillis', insert: 'currentTimeMillis()', kind: 'fn', detail: 'Epoch millis' },
];

const SYSTEM_OUT_DOT: Item[] = [
  { label: 'println', insert: 'println(${1});', kind: 'fn', detail: 'Print line' },
  { label: 'print', insert: 'print(${1});', kind: 'fn', detail: 'Print without newline' },
  { label: 'printf', insert: 'printf(${1:"%s"}, ${2});', kind: 'fn', detail: 'Formatted print' },
];

const SCANNER_DOT: Item[] = [
  { label: 'nextInt', insert: 'nextInt()', kind: 'fn', detail: 'Read int' },
  { label: 'nextLong', insert: 'nextLong()', kind: 'fn', detail: 'Read long' },
  { label: 'next', insert: 'next()', kind: 'fn', detail: 'Read token' },
  { label: 'nextLine', insert: 'nextLine()', kind: 'fn', detail: 'Read rest of line' },
  { label: 'hasNext', insert: 'hasNext()', kind: 'fn', detail: 'More tokens?' },
  { label: 'hasNextInt', insert: 'hasNextInt()', kind: 'fn', detail: 'Next is int?' },
  { label: 'hasNextLine', insert: 'hasNextLine()', kind: 'fn', detail: 'More lines?' },
  { label: 'close', insert: 'close()', kind: 'fn', detail: 'Close scanner' },
];

const STRING_DOT: Item[] = [
  { label: 'length', insert: 'length()', kind: 'fn', detail: 'Character count' },
  { label: 'charAt', insert: 'charAt(${1:0})', kind: 'fn', detail: 'Char at index' },
  { label: 'substring', insert: 'substring(${1:0}, ${2})', kind: 'fn', detail: 'Slice string' },
  { label: 'equals', insert: 'equals(${1})', kind: 'fn', detail: 'Value equality' },
  { label: 'equalsIgnoreCase', insert: 'equalsIgnoreCase(${1})', kind: 'fn', detail: 'Case-insensitive equals' },
  { label: 'split', insert: 'split(${1:" "})', kind: 'fn', detail: 'Split by regex' },
  { label: 'trim', insert: 'trim()', kind: 'fn', detail: 'Strip whitespace' },
  { label: 'toLowerCase', insert: 'toLowerCase()', kind: 'fn', detail: 'Lowercase' },
  { label: 'toUpperCase', insert: 'toUpperCase()', kind: 'fn', detail: 'Uppercase' },
  { label: 'contains', insert: 'contains(${1})', kind: 'fn', detail: 'Substring check' },
  { label: 'replace', insert: 'replace(${1}, ${2})', kind: 'fn', detail: 'Replace chars' },
  { label: 'isEmpty', insert: 'isEmpty()', kind: 'fn', detail: 'Length == 0' },
];

const LIST_DOT: Item[] = [
  { label: 'add', insert: 'add(${1})', kind: 'fn', detail: 'Append element' },
  { label: 'get', insert: 'get(${1:0})', kind: 'fn', detail: 'Element at index' },
  { label: 'set', insert: 'set(${1:0}, ${2})', kind: 'fn', detail: 'Replace at index' },
  { label: 'size', insert: 'size()', kind: 'fn', detail: 'Element count' },
  { label: 'remove', insert: 'remove(${1})', kind: 'fn', detail: 'Remove element' },
  { label: 'isEmpty', insert: 'isEmpty()', kind: 'fn', detail: 'No elements?' },
  { label: 'contains', insert: 'contains(${1})', kind: 'fn', detail: 'Membership' },
];

const MAP_DOT: Item[] = [
  { label: 'put', insert: 'put(${1}, ${2})', kind: 'fn', detail: 'Insert key/value' },
  { label: 'get', insert: 'get(${1})', kind: 'fn', detail: 'Value for key' },
  { label: 'containsKey', insert: 'containsKey(${1})', kind: 'fn', detail: 'Key exists?' },
  { label: 'keySet', insert: 'keySet()', kind: 'fn', detail: 'Keys' },
  { label: 'values', insert: 'values()', kind: 'fn', detail: 'Values' },
  { label: 'size', insert: 'size()', kind: 'fn', detail: 'Entry count' },
];

const CPP_ITEMS: Item[] = [
  { label: 'include bits', insert: '#include <bits/stdc++.h>', kind: 'mod', detail: 'GCC all-in-one header' },
  { label: 'vector', insert: 'vector<${1:int}>', kind: 'cls', detail: 'std::vector' },
  { label: 'string', insert: 'string', kind: 'cls', detail: 'std::string' },
  { label: 'unordered_map', insert: 'unordered_map<${1:int}, ${2:int}>', kind: 'cls', detail: 'Hash map' },
  { label: 'cout', insert: 'cout << ${1} << endl;', kind: 'fn', detail: 'Print line' },
  { label: 'cin', insert: 'cin >> ${1};', kind: 'fn', detail: 'Read token' },
  { label: 'sort', insert: 'sort(${1:v}.begin(), ${1:v}.end());', kind: 'fn', detail: 'Sort range' },
];

const C_ITEMS: Item[] = [
  { label: 'include stdio', insert: '#include <stdio.h>', kind: 'mod', detail: 'printf / scanf' },
  { label: 'include stdlib', insert: '#include <stdlib.h>', kind: 'mod', detail: 'malloc / qsort' },
  { label: 'include string', insert: '#include <string.h>', kind: 'mod', detail: 'strlen / memcpy' },
  { label: 'printf', insert: 'printf(${1:"%d\\n"}, ${2});', kind: 'fn', detail: 'Formatted print' },
  { label: 'scanf', insert: 'scanf(${1:"%d"}, &${2});', kind: 'fn', detail: 'Read formatted' },
  { label: 'puts', insert: 'puts(${1});', kind: 'fn', detail: 'Print string + newline' },
];

export function setupMonacoLanguages(monaco: Monaco) {
  if (registered) return;
  registered = true;

  monaco.editor.defineTheme('comm-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      { token: 'keyword', foreground: '0f766e', fontStyle: 'bold' },
      { token: 'string', foreground: '047857' },
      { token: 'number', foreground: 'b45309' },
      { token: 'type', foreground: '1d4ed8' },
      { token: 'identifier', foreground: '0f172a' },
      { token: 'delimiter', foreground: '334155' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#0f172a',
      'editorLineNumber.foreground': '#94a3b8',
      'editorLineNumber.activeForeground': '#0f766e',
      'editorCursor.foreground': '#0f766e',
      'editor.selectionBackground': '#ccfbf199',
      'editor.inactiveSelectionBackground': '#e2e8f0',
      'editor.lineHighlightBackground': '#f8fafc',
      'editorSuggestWidget.background': '#ffffff',
      'editorSuggestWidget.border': '#e2e8f0',
      'editorSuggestWidget.selectedBackground': '#ccfbf1',
    },
  });

  monaco.languages.registerCompletionItemProvider('java', {
    triggerCharacters: ['.'],
    provideCompletionItems(model: { getWordUntilPosition: (p: unknown) => { startColumn: number; endColumn: number }; getValueInRange: (r: object) => string }, position: { lineNumber: number; column: number }) {
      const range = rangeAt(model, position);
      const prefix = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      const trimmed = prefix.trimEnd();
      if (/\bimport\s+[\w.]*$/.test(trimmed)) {
        return { suggestions: suggestions(monaco, JAVA_IMPORTS, range) };
      }
      if (/\bSystem\.out\.$/.test(trimmed) || /\.out\.$/.test(trimmed)) {
        return { suggestions: suggestions(monaco, SYSTEM_OUT_DOT, range) };
      }
      if (/\bSystem\.$/.test(trimmed)) {
        return { suggestions: suggestions(monaco, SYSTEM_DOT, range) };
      }
      if (/\b(sc|scanner|in)\.$/i.test(trimmed)) {
        return { suggestions: suggestions(monaco, SCANNER_DOT, range) };
      }
      if (/\b(list|arr|nums|result)\.$/i.test(trimmed)) {
        return { suggestions: suggestions(monaco, LIST_DOT, range) };
      }
      if (/\b(map|hm|freq)\.$/i.test(trimmed)) {
        return { suggestions: suggestions(monaco, MAP_DOT, range) };
      }
      if (/\b(s|str|line|word)\.$/i.test(trimmed)) {
        return { suggestions: suggestions(monaco, STRING_DOT, range) };
      }
      if (trimmed.endsWith('.')) {
        return { suggestions: suggestions(monaco, [...STRING_DOT, ...LIST_DOT, ...MAP_DOT, ...SCANNER_DOT], range) };
      }
      return { suggestions: suggestions(monaco, JAVA_TYPES, range) };
    },
  });

  monaco.languages.registerCompletionItemProvider('cpp', {
    triggerCharacters: ['#', '<'],
    provideCompletionItems(model: { getWordUntilPosition: (p: unknown) => { startColumn: number; endColumn: number }; getValueInRange: (r: object) => string }, position: { lineNumber: number; column: number }) {
      return { suggestions: suggestions(monaco, CPP_ITEMS, rangeAt(model, position)) };
    },
  });

  monaco.languages.registerCompletionItemProvider('c', {
    triggerCharacters: ['#', '<'],
    provideCompletionItems(model: { getWordUntilPosition: (p: unknown) => { startColumn: number; endColumn: number }; getValueInRange: (r: object) => string }, position: { lineNumber: number; column: number }) {
      return { suggestions: suggestions(monaco, C_ITEMS, rangeAt(model, position)) };
    },
  });
}
