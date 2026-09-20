import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { Button, TextField } from '@comm-platform/ui';
import {
  CONTACT_DAILY_LIMIT_MESSAGE,
  contactUsSchema,
  type ContactUsInput,
} from '@comm-platform/validation';

import { AuthScreen } from '@/components/auth-screen';
import { ResultDialog } from '@/components/result-dialog';
import { ApiError } from '@/coding/api/client';
import { submitContactMessage } from '@/coding/api/contactApi';
import { fetchOwnProfile } from '@/lib/auth-actions';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

type AlertState = { title: string; body: string; ok: boolean } | null;

export default function ContactScreen() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [sentToday, setSentToday] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    enabled: Boolean(user?.id) && isSupabaseConfigured(),
    queryFn: () => fetchOwnProfile(getSupabase(), user!.id),
  });

  const { control, handleSubmit, getValues, reset, setValue } = useForm<ContactUsInput>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {
      name: '',
      email: user?.email ?? '',
      description: '',
    },
  });

  useEffect(() => {
    const current = getValues();
    const nextName = current.name || profileQuery.data?.displayName || '';
    const nextEmail = current.email || user?.email || '';
    if ((nextName && nextName !== current.name) || (nextEmail && nextEmail !== current.email)) {
      reset({
        name: nextName || current.name,
        email: nextEmail || current.email,
        description: current.description,
      });
    }
  }, [getValues, profileQuery.data?.displayName, reset, user?.email]);

  const onSubmit = handleSubmit(async (values) => {
    if (sentToday) {
      setAlert({
        title: 'Already sent today',
        body: CONTACT_DAILY_LIMIT_MESSAGE,
        ok: false,
      });
      return;
    }

    setSubmitting(true);
    try {
      await submitContactMessage(values);
      setSentToday(true);
      setValue('description', '');
      setAlert({
        title: 'Message sent',
        body: 'Thanks, we received your message. We will get back to you by email.',
        ok: true,
      });
    } catch (error) {
      const failed = error instanceof ApiError;
      const dailyLimit = failed && error.status === 429;
      if (dailyLimit) setSentToday(true);
      setAlert({
        title: dailyLimit ? 'Already sent today' : 'Could not send',
        body: failed ? error.message : 'Could not send your message. Please try again.',
        ok: false,
      });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthScreen
      title="Contact Us"
      subtitle="Send a question or issue. You can submit one message per day after a successful send."
    >
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <TextField
            label="Name"
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
        name="description"
        render={({ field, fieldState }) => (
          <TextField
            label="Description"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={styles.description}
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Button
        label={submitting ? 'Sending…' : 'Submit'}
        disabled={submitting}
        onPress={() => void onSubmit()}
      />
      <ResultDialog
        visible={Boolean(alert)}
        title={alert?.title ?? ''}
        body={alert?.body ?? ''}
        ok={alert?.ok ?? false}
        onClose={() => setAlert(null)}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  description: { minHeight: 140, paddingVertical: 12 },
});
