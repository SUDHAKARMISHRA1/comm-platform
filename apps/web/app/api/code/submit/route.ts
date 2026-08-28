import { NextResponse, type NextRequest } from 'next/server';

import {
  compareOutput,
  getHiddenTests,
  getJudge0LanguageId,
  getMockQuestion,
  mockSubmitCode,
  submitToJudge0,
  validateLanguage,
} from '@comm-platform/coding';

import { rateLimitResponse, requireApiUser } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;

  if (request.headers.get('x-rate-limit-test') === '1') {
    return rateLimitResponse();
  }

  let body: { questionId?: number; language?: string; sourceCode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { questionId, language, sourceCode } = body;
  if (!questionId || !getMockQuestion(questionId)) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }
  if (!language || !validateLanguage(language)) {
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
  }
  if (!sourceCode?.trim()) {
    return NextResponse.json({ error: 'Source code is required' }, { status: 400 });
  }

  const submissionId = `sub-${Date.now()}`;
  const judge0Url = process.env.JUDGE0_BASE_URL;

  try {
    if (!judge0Url) {
      const mock = mockSubmitCode(questionId, sourceCode);
      return NextResponse.json({ submissionId, ...mock });
    }

    const tests = getHiddenTests(questionId);
    const results: { index: number; passed: boolean; hidden: boolean }[] = [];
    let passed = 0;

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]!;
      const result = await submitToJudge0(
        judge0Url,
        getJudge0LanguageId(language),
        sourceCode,
        test.input,
        process.env.JUDGE0_API_KEY,
      );
      const ok = result.status === 'ACCEPTED' && compareOutput(result.stdout, test.output);
      if (ok) passed++;
      results.push({ index: i + 1, passed: ok, hidden: i >= 2 });
    }

    const total = Math.max(tests.length, 5);
    const status = passed === tests.length ? 'ACCEPTED' : 'WRONG_ANSWER';

    return NextResponse.json({
      submissionId,
      status,
      passedTestCases: passed,
      totalTestCases: total,
      executionTime: '0.20s',
      memory: '15 MB',
      testCaseResults: results.length
        ? results
        : Array.from({ length: total }, (_, i) => ({ index: i + 1, passed: false, hidden: i >= 2 })),
    });
  } catch {
    return NextResponse.json({ error: 'Submission service unavailable' }, { status: 503 });
  }
}
