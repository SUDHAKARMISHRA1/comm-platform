import { Link } from 'expo-router';
import { Text } from 'react-native';

import { AuthScreen } from '@/components/auth-screen';
import { colors, type } from '@comm-platform/ui';

export default function SetupScreen() {
  return (
    <AuthScreen
      title="Connect Supabase"
      subtitle="Copy apps/app/.env.example to apps/app/.env, add your project URL and anon key, then restart Expo. Never add the service role key here."
    >
      <Text style={{ color: colors.textMuted, fontSize: type.body, lineHeight: 22 }}>
        Until those public variables are set, signup and login cannot run. After you restart, return to sign in.
      </Text>
      <Link href="/login" style={{ color: colors.primary, fontWeight: '600' }}>
        Go to sign in
      </Link>
    </AuthScreen>
  );
}
