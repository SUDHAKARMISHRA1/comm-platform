import { NextResponse, type NextRequest } from 'next/server';

import { getSubmissionForUser } from '@comm-platform/coding/server';

import { requireApiUser } from '@/lib/api-auth';

type Params = { params: Promise<{ submissionId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;

  const { submissionId } = await params;
  const submission = await getSubmissionForUser(auth.user.id, submissionId);
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(submission);
}
