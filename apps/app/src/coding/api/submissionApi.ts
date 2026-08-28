import { getMockSubmission, listMockSubmissions, type SubmissionDetail } from '@comm-platform/coding';

import { USE_MOCK_API, apiFetch } from './client';

export async function fetchSubmissions() {
  if (USE_MOCK_API) return { submissions: listMockSubmissions() };
  return apiFetch<{ submissions: SubmissionDetail[] }>('/submissions');
}

export async function fetchSubmission(id: string): Promise<SubmissionDetail> {
  if (USE_MOCK_API) {
    const s = getMockSubmission(id);
    if (!s) throw new Error('Submission not found');
    return s;
  }
  return apiFetch(`/submissions/${id}`);
}
