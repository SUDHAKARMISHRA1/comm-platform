export const DIFFICULTY_FILL = {
  EASY: '#16a34a',
  MEDIUM: '#eab308',
  HARD: '#dc2626',
} as const;

export function submissionTone(status: string): 'ok' | 'pending' | 'fail' {
  if (status === 'ACCEPTED') return 'ok';
  if (status === 'QUEUED' || status === 'RUNNING') return 'pending';
  return 'fail';
}
