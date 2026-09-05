/** Run / hidden tests / submit. Mock path is used when `EXPO_PUBLIC_USE_MOCK_API=true`. */
import {
  mockRunCode,
  mockSubmitCode,
  type ExecutionResult,
  type LanguageKey,
  type RunCodeRequest,
  type RunTestsResponse,
  type SubmitCodeResponse,
} from '@comm-platform/coding';

import { USE_MOCK_API, apiFetch } from './client';

export async function runCode(
  payload: RunCodeRequest & { questionId?: number },
): Promise<ExecutionResult> {
  if (USE_MOCK_API) return mockRunCode(payload.sourceCode, payload.stdin);
  return apiFetch('/code/run', { method: 'POST', body: JSON.stringify(payload) });
}

export async function runTests(payload: {
  questionId: number;
  language: LanguageKey;
  sourceCode: string;
}): Promise<RunTestsResponse> {
  if (USE_MOCK_API) {
    const result = mockSubmitCode(payload.questionId, payload.sourceCode);
    return {
      ...result,
      stdout: '',
      stderr: '',
      compileOutput: '',
    };
  }
  return apiFetch('/code/tests', { method: 'POST', body: JSON.stringify(payload) });
}

export async function submitCode(payload: {
  questionId: number;
  language: LanguageKey;
  sourceCode: string;
}): Promise<SubmitCodeResponse> {
  if (USE_MOCK_API) {
    const result = mockSubmitCode(payload.questionId, payload.sourceCode);
    return { submissionId: `sub-${Date.now()}`, ...result };
  }
  return apiFetch('/code/submit', { method: 'POST', body: JSON.stringify(payload) });
}
