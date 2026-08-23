export function toUserMessage(error: { message?: string; code?: string } | string | null | undefined): string {
  const raw = typeof error === 'string' ? error : (error?.message ?? '');
  const code = typeof error === 'object' && error ? error.code : undefined;
  const message = raw.toLowerCase();

  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return 'Invalid email or password.';
  }
  if (message.includes('email not confirmed')) {
    return 'Confirm your email before signing in. Check your inbox for the link.';
  }
  if (message.includes('user already registered') || message.includes('already registered')) {
    return 'An account with this email already exists. Try signing in.';
  }
  if (message.includes('password should be at least')) {
    return 'Password is too short. Use at least 8 characters.';
  }
  if (message.includes('duplicate key') || message.includes('already exists')) {
    return 'That username is already taken. Choose another.';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many attempts. Wait a moment and try again.';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Network error. Check your connection and try again.';
  }
  if (!raw) {
    return 'Something went wrong. Please try again.';
  }
  return raw;
}
