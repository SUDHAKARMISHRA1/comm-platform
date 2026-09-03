import { NextResponse, type NextRequest } from 'next/server';

import { toggleFeedLike } from '@comm-platform/coding/server';

import { requireApiUser } from '@/lib/api-auth';

type Params = { params: Promise<{ postId: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;
  const { postId } = await params;
  try {
    return NextResponse.json(await toggleFeedLike(auth.user.id, postId));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update like';
    return NextResponse.json({ error: message }, { status: message === 'Post not found' ? 404 : 400 });
  }
}
