/** POST /api/code/run — execute source with the user's Bearer token. */
import { NextResponse, type NextRequest } from 'next/server';

import { runUserCode } from '@comm-platform/coding/server';
import { validateLanguage } from '@comm-platform/coding';

import { rateLimitResponse, requireApiUser } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;
  if (request.headers.get('x-rate-limit-test') === '1') return rateLimitResponse();

  let body: { language?: string; sourceCode?: string; stdin?: string; questionId?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { language, sourceCode, stdin, questionId } = body;
  if (!language || !validateLanguage(language)) {
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
  }
  if (!sourceCode?.trim()) return NextResponse.json({ error: 'Source code required' }, { status: 400 });

  try {
    const result = await runUserCode(
      language,
      sourceCode,
      stdin ?? '',
      auth.user.id,
      typeof questionId === 'number' ? questionId : undefined,
    );
    return NextResponse.json({
      status: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      executionTime: result.executionTime,
      memory: result.memory,
    });
  } catch {
    return NextResponse.json({ error: 'Execution unavailable' }, { status: 503 });
  }
}
