const MONACO_VS = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs';

type Monaco = {
  editor: {
    create: (el: HTMLElement, options: Record<string, unknown>) => unknown;
    defineTheme: (name: string, theme: Record<string, unknown>) => void;
    setTheme: (name: string) => void;
    setModelLanguage: (model: unknown, language: string) => void;
  };
  languages: {
    registerCompletionItemProvider: (lang: string, provider: object) => void;
    CompletionItemKind: Record<string, number>;
    CompletionItemInsertTextRule: { InsertAsSnippet: number };
  };
  KeyMod: { CtrlCmd: number };
  KeyCode: { Enter: number };
};

declare global {
  interface Window {
    monaco?: Monaco;
    require?: { config: (opts: { paths: { vs: string } }) => void; (mods: string[], cb: () => void): void };
    MonacoEnvironment?: { getWorkerUrl?: (id: string, label: string) => string };
  }
}

let loading: Promise<Monaco> | null = null;

function workerUrl(label: string) {
  const worker =
    label === 'json'
      ? `${MONACO_VS}/language/json/json.worker.js`
      : `${MONACO_VS}/editor/editor.worker.js`;
  const body = `self.MonacoEnvironment={baseUrl:'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/'};importScripts('${worker}');`;
  return `data:text/javascript;charset=utf-8,${encodeURIComponent(body)}`;
}

export function loadMonaco(): Promise<Monaco> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Monaco is web-only'));
  }
  if (window.monaco) return Promise.resolve(window.monaco);
  if (loading) return loading;

  window.MonacoEnvironment = {
    getWorkerUrl: (_id, label) => workerUrl(label),
  };

  loading = new Promise((resolve, reject) => {
    const prevRequire = window.require;
    const start = () => {
      const amdRequire = window.require;
      if (typeof amdRequire?.config !== 'function') {
        reject(new Error('Monaco AMD loader missing'));
        return;
      }
      amdRequire.config({ paths: { vs: MONACO_VS } });
      amdRequire(['vs/editor/editor.main'], () => {
        window.require = prevRequire;
        if (!window.monaco) {
          reject(new Error('Monaco failed to initialize'));
          return;
        }
        resolve(window.monaco);
      });
    };

    const existing = document.querySelector<HTMLScriptElement>('script[data-monaco-loader]');
    if (existing) {
      if (typeof window.require?.config === 'function') start();
      else existing.addEventListener('load', start, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.dataset.monacoLoader = 'true';
    script.src = `${MONACO_VS}/loader.js`;
    script.async = true;
    script.onload = start;
    script.onerror = () => reject(new Error('Failed to load Monaco editor'));
    document.head.appendChild(script);

    if (!document.querySelector('link[data-monaco-css]')) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = `${MONACO_VS}/editor/editor.main.css`;
      css.dataset.monacoCss = 'true';
      document.head.appendChild(css);
    }
  });

  return loading;
}
