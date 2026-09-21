import { NextResponse, type NextRequest } from 'next/server';

import { GUEST_FEED_LIMIT, listPublishedFeed } from '@comm-platform/coding/server';

import { optionalApiUser } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = await optionalApiUser(request);
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get('page') ?? '1');
  const requestedSize = Number(searchParams.get('pageSize') ?? '3');

  if (!auth.user) {
    if (page > 1) {
      return NextResponse.json(
        { error: 'Sign in to keep reading Highlights.', code: 'SIGNUP_REQUIRED' },
        { status: 401 },
      );
    }
    const preview = await listPublishedFeed('', 1, GUEST_FEED_LIMIT, { preferArticles: true });
    return NextResponse.json(preview);
  }

  const result = await listPublishedFeed(auth.user.id, page, requestedSize);
  return NextResponse.json(result);
}
