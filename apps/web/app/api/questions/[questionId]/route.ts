import { NextResponse, type NextRequest } from 'next/server';

import { getAdjacentQuestionIds, getMockQuestion } from '@comm-platform/coding';

import { requireApiUser } from '@/lib/api-auth';

type Params = { params: Promise<{ questionId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;

  const { questionId } = await params;
  const id = Number(questionId);
  const question = getMockQuestion(id);
  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  const navigation = getAdjacentQuestionIds(id);
  return NextResponse.json({ ...question, navigation });
}
