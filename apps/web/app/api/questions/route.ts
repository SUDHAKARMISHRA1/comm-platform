import { NextResponse, type NextRequest } from 'next/server';

import { listQuestionsForUser } from '@comm-platform/coding';

import { requireApiUser } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;

  const { searchParams } = request.nextUrl;
  const result = await listQuestionsForUser(auth.user.id, {
    q: searchParams.get('q') ?? undefined,
    difficulty: searchParams.get('difficulty') ?? undefined,
    topic: searchParams.get('topic') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    page: Number(searchParams.get('page') ?? '1'),
    pageSize: Number(searchParams.get('pageSize') ?? '20'),
  });
  return NextResponse.json(result);
}
