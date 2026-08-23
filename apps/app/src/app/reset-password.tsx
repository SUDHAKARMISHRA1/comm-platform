import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { toUserMessage } from '@comm-platform/api';
import { Button, TextField } from '@comm-platform/ui';
import { resetPasswordSchema, type ResetPasswordInput } from '@comm-platform/validation';

import { AuthScreen, FormMessage } from '@/components/auth-screen';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export default function ResetPasswordScreen() {
  const [message, setMessage] = useState<string | undefined>();
  const [tone, setTone] = useState<'danger' | 'success'>('danger');
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!isSupabaseConfigured()) {
      setMessage('Supabase is not configured yet.');
      return;
    }
    setSubmitting(true);
    const { error } = await getSupabase().auth.updateUser({ password: values.password });
    setSubmitting(false);
    if (error) {
      setTone('danger');
      setMessage(toUserMessage(error));
      return;
    }
    setTone('success');
    setMessage('Password updated. Redirecting home…');
    router.replace('/home');
  });

  return (
    <AuthScreen title="Choose a new password" subtitle="Open this screen from the email link so the recovery session is active.">
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <TextField
            label="New password"
            secureTextEntry
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
            label="Confirm new password"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <FormMessage message={message} tone={tone} />
      <Button label={submitting ? 'Updating…' : 'Update password'} disabled={submitting} onPress={onSubmit} />
    </AuthScreen>
  );
}
