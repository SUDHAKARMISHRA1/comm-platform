/** Entry route: setup (no env) → highlights (signed in) or home (signed out). */
import { Redirect } from 'expo-router';

import { PageLoader } from '@/components/page-loader';
import { useAuth } from '@/providers/auth-provider';

export default function IndexScreen() {
  const { configured, loading, session } = useAuth();

  if (loading) {
    return <PageLoader fullScreen message="Getting your workspace ready…" />;
  }

  if (!configured) {
    return <Redirect href="/setup" />;
  }

  return <Redirect href={session ? '/highlights' : '/home'} />;
}
