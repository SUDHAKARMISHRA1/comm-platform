/**
 * Remote executors and test doubles for run/submit.
 * Judge0 and Piston are called only from the Next.js server, never the browser.
 */
import type { ExecutionResult, ExecutionStatus, LanguageKey } from './types';
import { getHiddenTests } from './mocks/data';

function normalizeOutput(s: string) {
  return s.trim().replace(/\r\n/g, '\n');
}

export function mockRunCode(sourceCode: string, stdin: string): ExecutionResult {
  if (sourceCode.includes('COMPILE_ERROR')) {
    return {
      status: 'COMPILATION_ERROR',
      stdout: '',
      stderr: '',
      compileOutput: 'Main.java:8: error: \';\' expected',
      executionTime: 0,
      memory: 0,
    };
  }
  if (sourceCode.includes('RUNTIME_ERROR')) {
    return {
      status: 'RUNTIME_ERROR',
      stdout: '',
      stderr: 'Exception in thread "main" java.lang.NullPointerException',
      compileOutput: '',
      executionTime: 0.05,
      memory: 12000,
    };
  }

  const lines = stdin.trim().split('\n');
  let stdout = '';
  if (lines[0] === '5' && lines[1] === '1 2 3 4 5') stdout = '15';
  else if (lines[0] === 'hello') stdout = 'olleh';
  else if (lines[0] === '121') stdout = 'true';
  else stdout = stdin ? `Processed ${lines.length} line(s)` : '';

  return {
    status: 'ACCEPTED',
    stdout,
    stderr: '',
    compileOutput: '',
    executionTime: 0.12 + Math.random() * 0.08,
    memory: 14000 + Math.floor(Math.random() * 2000),
  };
}

export function mockSubmitCode(questionId: number, sourceCode: string): {
  status: ExecutionStatus;
  passedTestCases: number;
  totalTestCases: number;
  executionTime: string;
  memory: string;
  testCaseResults: { index: number; passed: boolean; hidden: boolean }[];
} {
  const tests = getHiddenTests(questionId);
  const total = Math.max(tests.length, 5);
  const accept = !sourceCode.includes('WRONG_ANSWER') && sourceCode.trim().length > 20;
  const passed = accept ? total : Math.max(1, Math.floor(total * 0.7));

  const testCaseResults = Array.from({ length: total }, (_, i) => ({
    index: i + 1,
    passed: i < passed,
    hidden: i >= 2,
  }));

  return {
    status: accept ? 'ACCEPTED' : 'WRONG_ANSWER',
    passedTestCases: passed,
    totalTestCases: total,
    executionTime: `${(0.15 + Math.random() * 0.15).toFixed(2)}s`,
    memory: `${14 + Math.floor(Math.random() * 4)} MB`,
    testCaseResults,
  };
}

export function compareOutput(actual: string, expected: string) {
  return normalizeOutput(actual) === normalizeOutput(expected);
}

export type Judge0Status = {
  token: string;
  status?: { id: number; description: string };
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  time?: string | null;
  memory?: number | null;
};

export function mapJudge0Status(data: Judge0Status): ExecutionResult {
  const desc = data.status?.description ?? 'Internal Error';
  let status: ExecutionStatus = 'INTERNAL_ERROR';
  if (desc === 'Accepted') status = 'ACCEPTED';
  else if (desc === 'Wrong Answer') status = 'WRONG_ANSWER';
  else if (desc.includes('Compilation')) status = 'COMPILATION_ERROR';
  else if (desc.includes('Time Limit')) status = 'TIME_LIMIT_EXCEEDED';
  else if (desc.includes('Memory Limit')) status = 'MEMORY_LIMIT_EXCEEDED';
  else if (desc.includes('Runtime')) status = 'RUNTIME_ERROR';
  return {
    status,
    stdout: data.stdout ?? '',
    stderr: data.stderr ?? '',
    compileOutput: data.compile_output ?? '',
    executionTime: Number(data.time ?? 0),
    memory: data.memory ?? 0,
  };
}

export async function pollJudge0(
  baseUrl: string,
  token: string,
  apiKey?: string,
  maxAttempts = 20,
): Promise<ExecutionResult> {
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['X-RapidAPI-Key'] = apiKey;
    headers['X-RapidAPI-Host'] = new URL(baseUrl).host;
  }

  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${baseUrl}/submissions/${token}?fields=*`, { headers });
    if (!res.ok) throw new Error('Judge0 unavailable');
    const data = (await res.json()) as Judge0Status;
    if (data.status && data.status.id <= 2) {
      await new Promise((r) => setTimeout(r, 500));
      continue;
    }
    return mapJudge0Status(data);
  }
  return { status: 'INTERNAL_ERROR', stdout: '', stderr: 'Execution timed out', compileOutput: '', executionTime: 0, memory: 0 };
}

export async function submitToJudge0(
  baseUrl: string,
  languageId: number,
  sourceCode: string,
  stdin: string,
  apiKey?: string,
): Promise<ExecutionResult> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers['X-RapidAPI-Key'] = apiKey;
    headers['X-RapidAPI-Host'] = new URL(baseUrl).host;
  }

  const res = await fetch(`${baseUrl}/submissions?base64_encoded=false&wait=false`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ source_code: sourceCode, language_id: languageId, stdin }),
  });
  if (!res.ok) throw new Error('Judge0 submission failed');
  const { token } = (await res.json()) as { token: string };
  return pollJudge0(baseUrl, token, apiKey);
}

export function validateLanguage(lang: string): lang is LanguageKey {
  return lang === 'java' || lang === 'c' || lang === 'cpp';
}

const PISTON_LANGUAGES: Record<LanguageKey, { language: string; file: string }> = {
  java: { language: 'java', file: 'Main.java' },
  c: { language: 'c', file: 'main.c' },
  cpp: { language: 'c++', file: 'main.cpp' },
};

type PistonResponse = {
  compile?: { stdout?: string; stderr?: string; output?: string; code?: number; signal?: string | null };
  run?: { stdout?: string; stderr?: string; output?: string; code?: number; signal?: string | null };
  message?: string;
};

export function mapPistonResult(data: PistonResponse): ExecutionResult {
  const compile = data.compile;
  const run = data.run;
  if (compile && compile.code !== 0 && compile.code != null) {
    return {
      status: 'COMPILATION_ERROR',
      stdout: '',
      stderr: compile.stderr ?? '',
      compileOutput: (compile.stderr || compile.stdout || compile.output || '').trim(),
      executionTime: 0,
      memory: 0,
    };
  }
  const signal = run?.signal ?? '';
  if (signal === 'SIGKILL' || signal === 'SIGXCPU') {
    return {
      status: 'TIME_LIMIT_EXCEEDED',
      stdout: run?.stdout ?? '',
      stderr: run?.stderr ?? 'Time limit exceeded',
      compileOutput: '',
      executionTime: 0,
      memory: 0,
    };
  }
  if (run && run.code !== 0 && run.code != null) {
    return {
      status: 'RUNTIME_ERROR',
      stdout: run.stdout ?? '',
      stderr: (run.stderr || run.output || 'Runtime error').trim(),
      compileOutput: '',
      executionTime: 0,
      memory: 0,
    };
  }
  return {
    status: 'ACCEPTED',
    stdout: run?.stdout ?? '',
    stderr: run?.stderr ?? '',
    compileOutput: '',
    executionTime: 0.1,
    memory: 12000,
  };
}

export async function executeWithPiston(
  language: LanguageKey,
  sourceCode: string,
  stdin: string,
  baseUrl: string,
): Promise<ExecutionResult> {
  const spec = PISTON_LANGUAGES[language];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        language: spec.language,
        version: '*',
        files: [{ name: spec.file, content: sourceCode }],
        stdin,
        compile_timeout: 10_000,
        run_timeout: 5_000,
      }),
    });
    if (!res.ok) throw new Error(`Piston HTTP ${res.status}`);
    const data = (await res.json()) as PistonResponse;
    if (data.message && !data.run && !data.compile) throw new Error(data.message);
    return mapPistonResult(data);
  } finally {
    clearTimeout(timer);
  }
}
