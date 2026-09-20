import type { ContactUsInput } from '@comm-platform/validation';

import { apiFetch } from './client';

export function submitContactMessage(input: ContactUsInput) {
  return apiFetch<{ id: string; createdAt: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
