import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { toUserMessage } from '@comm-platform/api';
import { Button, TextField, colors, radius, space, type } from '@comm-platform/ui';
import { updateProfileSchema, type UpdateProfileInput } from '@comm-platform/validation';

import { FormMessage } from '@/components/auth-screen';
import { AppShell } from '@/components/app-shell';
import { fetchOwnProfile } from '@/lib/auth-actions';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

export default function ProfileScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | undefined>();
  const [tone, setTone] = useState<'danger' | 'success'>('danger');
  const [uploading, setUploading] = useState(false);

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchOwnProfile(getSupabase(), user!.id),
  });

  const form = useForm<UpdateProfileInput>({
    defaultValues: { displayName: '', username: '', bio: '' },
  });

  useEffect(() => {
    if (profileQuery.data) {
      form.reset({
        displayName: profileQuery.data.displayName ?? '',
        username: profileQuery.data.username ?? '',
        bio: profileQuery.data.bio ?? '',
      });
    }
  }, [form, profileQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (values: UpdateProfileInput) => {
      if (!user) throw new Error('You must be signed in.');
      const { error } = await getSupabase()
        .from('profiles')
        .update({
          display_name: values.displayName,
          username: values.username,
          bio: values.bio || null,
        })
        .eq('id', user.id);
      if (error) throw new Error(toUserMessage(error));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      setTone('success');
      setMessage('Profile saved.');
    },
    onError: (error: Error) => {
      setTone('danger');
      setMessage(error.message);
    },
  });

  async function onPickAvatar() {
    if (!user) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setTone('danger');
      setMessage('Photo permission is required to change your avatar.');
      return;
    }
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (picked.canceled || !picked.assets[0]) return;

    const asset = picked.assets[0];
    setUploading(true);
    try {
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const path = `${user.id}/avatar.jpg`;
      const { error: uploadError } = await getSupabase().storage.from('avatars').upload(path, blob, {
        upsert: true,
        contentType: blob.type || 'image/jpeg',
      });
      if (uploadError) throw uploadError;
      const { data } = getSupabase().storage.from('avatars').getPublicUrl(path);
      const { error: updateError } = await getSupabase()
        .from('profiles')
        .update({ avatar_url: `${data.publicUrl}?t=${Date.now()}` })
        .eq('id', user.id);
      if (updateError) throw updateError;
      await queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      setTone('success');
      setMessage('Avatar updated.');
    } catch (error) {
      setTone('danger');
      setMessage(toUserMessage(error as { message?: string }));
    } finally {
      setUploading(false);
    }
  }

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
        <Text style={styles.title}>Your profile</Text>
        {profileQuery.isLoading ? <ActivityIndicator color={colors.primary} /> : null}
        {profileQuery.isError ? <FormMessage message="Could not load profile." /> : null}
        {profileQuery.data?.avatarUrl ? (
          <Image accessibilityLabel="Current avatar" source={{ uri: profileQuery.data.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.muted}>No photo</Text>
          </View>
        )}
        <Pressable onPress={onPickAvatar} disabled={uploading}>
          <Text style={styles.link}>{uploading ? 'Uploading…' : 'Change avatar'}</Text>
        </Pressable>
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <TextField label="Display name" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <Controller
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <TextField
              label="Username"
              autoCapitalize="none"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="bio"
          render={({ field, fieldState }) => (
            <TextField
              label="Bio"
              multiline
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
        <FormMessage message={message} tone={tone} />
        <Button
          label={saveMutation.isPending ? 'Saving…' : 'Save profile'}
          disabled={saveMutation.isPending}
          onPress={form.handleSubmit((values) => {
            const parsed = updateProfileSchema.parse(values);
            saveMutation.mutate(parsed);
          })}
        />
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: space.lg, alignItems: 'center' },
  card: {
    width: '100%',
    maxWidth: 560,
    gap: space.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.lg,
  },
  title: { color: colors.text, fontSize: type.title, fontWeight: '700' },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.surfaceMuted },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  muted: { color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '600' },
});
