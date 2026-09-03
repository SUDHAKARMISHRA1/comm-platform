import { NextResponse, type NextRequest } from 'next/server';

import { listPublishedFeed } from '@comm-platform/coding/server';

import { requireApiUser } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;

  const { searchParams } = request.nextUrl;
  const result = await listPublishedFeed(
    auth.user.id,
    Number(searchParams.get('page') ?? '1'),
    Number(searchParams.get('pageSize') ?? '3'),
  );
  return NextResponse.json(result);
}
