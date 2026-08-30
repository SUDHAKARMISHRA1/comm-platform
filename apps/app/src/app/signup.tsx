import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';

import { Button, TextField, colors, type } from '@comm-platform/ui';
import { signUpSchema, type SignUpInput } from '@comm-platform/validation';

import { AuthScreen, FormMessage } from '@/components/auth-screen';
import { signUp } from '@/lib/auth-actions';
import { persistSessionBackup } from '@/lib/session-backup';
import { isDemoAuthEnabled } from '@/lib/demo-auth';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

export default function SignUpScreen() {
  const { signInDemo } = useAuth();
  const [formError, setFormError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!isSupabaseConfigured()) {
      if (isDemoAuthEnabled()) {
        signInDemo(values.email);
        router.replace('/highlights');
        return;
      }
      router.replace('/setup');
      return;
    }
    setSubmitting(true);
    setFormError(undefined);
    setSuccess(undefined);
    const result = await signUp(getSupabase(), values);
    if (result.ok && !result.needsEmailConfirmation) {
      const { data } = await getSupabase().auth.getSession();
      persistSessionBackup(data.session ?? null);
    }
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    if (result.needsEmailConfirmation) {
      setSuccess(result.message);
      return;
    }
    router.replace('/highlights');
  });

  return (
    <AuthScreen
      title="Create your account"
      subtitle="Display name, email, and a password. A profile row is created automatically after signup."
    >
      <Controller
        control={control}
        name="displayName"
        render={({ field, fieldState }) => (
          <TextField
            label="Display name"
            autoComplete="name"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
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
            autoComplete="new-password"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field, fieldState }) => (
          <TextField
            label="Confirm password"
            secureTextEntry
            autoComplete="new-password"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <FormMessage message={formError} />
      <FormMessage message={success} tone="success" />
      <Button label={submitting ? 'Creating account…' : 'Create account'} disabled={submitting} onPress={onSubmit} />
      <Link href="/login" asChild>
        <Pressable>
          <Text style={{ color: colors.textMuted, fontSize: type.body }}>
            Already have an account? <Text style={{ color: colors.primary, fontWeight: '600' }}>Sign in</Text>
          </Text>
        </Pressable>
      </Link>
    </AuthScreen>
  );
}
