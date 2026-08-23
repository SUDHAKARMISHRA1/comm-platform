import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { colors } from '@comm-platform/ui';

import { useAuth } from '@/providers/auth-provider';

export default function IndexScreen() {
  const { configured, loading, session } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!configured) {
    return <Redirect href="/setup" />;
  }

  return <Redirect href={session ? '/home' : '/login'} />;
}
