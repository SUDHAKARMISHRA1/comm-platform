import { NextResponse, type NextRequest } from 'next/server';

import {
  getJudge0LanguageId,
  mockRunCode,
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

  let body: { language?: string; sourceCode?: string; stdin?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { language, sourceCode, stdin } = body;
  if (!language || !validateLanguage(language)) {
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
  }
  if (!sourceCode?.trim()) {
    return NextResponse.json({ error: 'Source code is required' }, { status: 400 });
  }

  const judge0Url = process.env.JUDGE0_BASE_URL;
  const judge0Key = process.env.JUDGE0_API_KEY;

  try {
    const result = judge0Url
      ? await submitToJudge0(judge0Url, getJudge0LanguageId(language), sourceCode, stdin ?? '', judge0Key)
      : mockRunCode(sourceCode, stdin ?? '');

    return NextResponse.json({
      status: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      executionTime: result.executionTime,
      memory: result.memory,
    });
  } catch {
    return NextResponse.json({ error: 'Code execution service unavailable' }, { status: 503 });
  }
}
