import { NextResponse, type NextRequest } from 'next/server';

import { listVotedQuestionsForUser } from '@comm-platform/coding/server';

import { requireApiUser } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;

  const { searchParams } = request.nextUrl;
  const result = await listVotedQuestionsForUser(auth.user.id, {
    skill: searchParams.get('skill') ?? undefined,
    page: Number(searchParams.get('page') ?? '1'),
    pageSize: Number(searchParams.get('pageSize') ?? '10'),
  });
  return NextResponse.json(result);
}
