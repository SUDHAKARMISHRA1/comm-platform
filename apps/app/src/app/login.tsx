import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';

import { Button, TextField, colors, type } from '@comm-platform/ui';
import { signInSchema, type SignInInput } from '@comm-platform/validation';

import { AuthScreen, FormMessage } from '@/components/auth-screen';
import { signIn } from '@/lib/auth-actions';
import { isDemoAuthEnabled } from '@/lib/demo-auth';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

export default function LoginScreen() {
  const { signInDemo } = useAuth();
  const [formError, setFormError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!isSupabaseConfigured()) {
      if (isDemoAuthEnabled()) {
        signInDemo(values.email);
        router.replace('/home');
        return;
      }
      router.replace('/setup');
      return;
    }
    setSubmitting(true);
    setFormError(undefined);
    const result = await signIn(getSupabase(), values);
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    router.replace('/home');
  });

  return (
    <AuthScreen title="Sign in" subtitle={isDemoAuthEnabled() ? 'Demo mode: use any valid email and password (8+ chars) to explore the app locally.' : 'Use the email and password for your Comm Platform account.'}>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <TextField
            label="Email"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <TextField
            label="Password"
            secureTextEntry
            autoComplete="password"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <FormMessage message={formError} />
      <Button label={submitting ? 'Signing in…' : 'Sign in'} disabled={submitting} onPress={onSubmit} />
      <Link href="/forgot-password" asChild>
        <Pressable>
          <Text style={{ color: colors.primary, fontSize: type.body }}>Forgot password?</Text>
        </Pressable>
      </Link>
      <Link href="/signup" asChild>
        <Pressable>
          <Text style={{ color: colors.textMuted, fontSize: type.body }}>
            Need an account? <Text style={{ color: colors.primary, fontWeight: '600' }}>Sign up</Text>
          </Text>
        </Pressable>
      </Link>
    </AuthScreen>
  );
}
