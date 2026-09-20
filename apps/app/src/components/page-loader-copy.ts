/** Short lines shown under the spinner. Rotated so a wait does not feel stuck. */
export const PAGE_LOADER_MESSAGES = [
  'Warming up the compiler…',
  'Fetching your next challenge…',
  'Lining up today’s highlights…',
  'Checking your practice streak…',
  'Almost there — loading the good stuff…',
] as const;

export function loaderMessageAt(index: number) {
  return PAGE_LOADER_MESSAGES[index % PAGE_LOADER_MESSAGES.length] ?? PAGE_LOADER_MESSAGES[0];
}
