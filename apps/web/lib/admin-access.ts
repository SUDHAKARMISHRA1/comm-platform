/** Pure access matrix for admin UI. A client-side `isAdmin` flag is never trusted. */
export type AdminAccess = 'unauthenticated' | 'forbidden' | 'allowed';

export function resolveAdminAccess(input: {
  userId: string | null | undefined;
  role: string | null | undefined;
}): AdminAccess {
  if (!input.userId) {
    return 'unauthenticated';
  }
  if (input.role !== 'admin') {
    return 'forbidden';
  }
  return 'allowed';
}
