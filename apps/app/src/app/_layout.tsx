/** QueryClient + AuthProvider + AuthGate wrap every Expo route. */
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { AuthGate } from '@/components/auth-gate';

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </QueryProvider>
  );
}
