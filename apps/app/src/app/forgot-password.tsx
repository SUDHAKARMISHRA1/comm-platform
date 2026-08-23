import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text } from 'react-native';

import { toUserMessage } from '@comm-platform/api';
import { Button, TextField, colors, type } from '@comm-platform/ui';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@comm-platform/validation';

import { AuthScreen, FormMessage } from '@/components/auth-screen';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export default function ForgotPasswordScreen() {
  const [message, setMessage] = useState<string | undefined>();
  const [tone, setTone] = useState<'danger' | 'success'>('danger');
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!isSupabaseConfigured()) {
      setTone('danger');
      setMessage('Supabase is not configured yet.');
      return;
    }
    setSubmitting(true);
    const redirectTo = Linking.createURL('reset-password');
    const { error } = await getSupabase().auth.resetPasswordForEmail(values.email, { redirectTo });
    setSubmitting(false);
    if (error) {
      setTone('danger');
      setMessage(toUserMessage(error));
      return;
    }
    setTone('success');
    setMessage('If that email exists, we sent a reset link. Open it on this device to set a new password.');
  });

  return (
    <AuthScreen title="Forgot password" subtitle="We will email a reset link. Add the app URL to Supabase Auth redirect allow-list.">
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <TextField
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <FormMessage message={message} tone={tone} />
      <Button label={submitting ? 'Sending…' : 'Send reset link'} disabled={submitting} onPress={onSubmit} />
      <Link href="/login" asChild>
        <Pressable>
          <Text style={{ color: colors.primary, fontSize: type.body }}>Back to sign in</Text>
        </Pressable>
      </Link>
    </AuthScreen>
  );
}
