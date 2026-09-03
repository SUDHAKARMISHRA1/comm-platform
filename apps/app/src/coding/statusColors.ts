export const DIFFICULTY_FILL = {
  EASY: '#22c55e',
  MEDIUM: '#f59e0b',
  HARD: '#ef4444',
} as const;

export function submissionTone(status: string): 'ok' | 'pending' | 'fail' {
  if (status === 'ACCEPTED') return 'ok';
  if (status === 'QUEUED' || status === 'RUNNING') return 'pending';
  return 'fail';
}
