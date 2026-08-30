import { NextResponse, type NextRequest } from 'next/server';

import { runSampleTests } from '@comm-platform/coding/server';
import { validateLanguage } from '@comm-platform/coding';

import { rateLimitResponse, requireApiUser } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;
  if (request.headers.get('x-rate-limit-test') === '1') return rateLimitResponse();

  let body: { questionId?: number; language?: string; sourceCode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { questionId, language, sourceCode } = body;
  if (!questionId) return NextResponse.json({ error: 'Question required' }, { status: 400 });
  if (!language || !validateLanguage(language)) {
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
  }
  if (!sourceCode?.trim()) return NextResponse.json({ error: 'Source code required' }, { status: 400 });

  try {
    const result = await runSampleTests(auth.user.id, questionId, language, sourceCode);
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Test run failed';
    if (msg.includes('not found')) return NextResponse.json({ error: msg }, { status: 404 });
    return NextResponse.json({ error: 'Execution unavailable' }, { status: 503 });
  }
}
