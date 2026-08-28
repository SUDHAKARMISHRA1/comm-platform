import { mockRunCode, type ExecutionResult, type LanguageKey, type RunCodeRequest, type SubmitCodeResponse } from '@comm-platform/coding';

import { USE_MOCK_API, apiFetch } from './client';

export async function runCode(payload: RunCodeRequest): Promise<ExecutionResult> {
  if (USE_MOCK_API) return mockRunCode(payload.sourceCode, payload.stdin);
  return apiFetch('/code/run', { method: 'POST', body: JSON.stringify(payload) });
}

export async function submitCode(payload: {
  questionId: number;
  language: LanguageKey;
  sourceCode: string;
}): Promise<SubmitCodeResponse> {
  if (USE_MOCK_API) {
    const { mockSubmitCode } = await import('@comm-platform/coding');
    const result = mockSubmitCode(payload.questionId, payload.sourceCode);
    return { submissionId: `sub-${Date.now()}`, ...result };
  }
  return apiFetch('/code/submit', { method: 'POST', body: JSON.stringify(payload) });
}
