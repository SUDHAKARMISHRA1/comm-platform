import { NextResponse, type NextRequest } from 'next/server';

import { toggleInterviewVote } from '@comm-platform/coding/server';

import { requireApiUser } from '@/lib/api-auth';

type Params = { params: Promise<{ questionId: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;

  const { questionId } = await params;
  const id = Number(questionId);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
  }

  try {
    const result = await toggleInterviewVote(auth.user.id, id);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update vote';
    const status = message === 'Question not found' ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
