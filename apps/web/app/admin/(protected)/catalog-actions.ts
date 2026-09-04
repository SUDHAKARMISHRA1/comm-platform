'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  deleteCmsPage,
  deleteFeedPost,
  deleteLevel,
  deleteNotification,
  deleteSkill,
  deleteTopic,
  listSkills,
  saveCmsPage,
  saveFeedPost,
  saveLevel,
  saveNotification,
  saveSettings,
  saveSkill,
  saveTopic,
  setFeedCommentHidden,
} from '@comm-platform/coding/server';
import type { Difficulty } from '@comm-platform/coding';
import type { NotificationAudience, NotificationChannel } from '@comm-platform/coding';

import { requireAdmin } from '@/lib/require-admin';

function revalidateAdmin() {
  revalidatePath('/admin', 'layout');
}

export async function upsertSkillAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '').trim() || undefined;
  const rawEnabled = formData.get('enabled');
  await saveSkill({
    id,
    name: String(formData.get('name') ?? ''),
    languageKey: String(formData.get('languageKey') ?? '') || null,
    enabled: rawEnabled == null ? undefined : rawEnabled === '1' || rawEnabled === 'on',
  });
  revalidateAdmin();
  redirect('/admin/skills');
}

export async function toggleSkillAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id'));
  const skills = await listSkills();
  const skill = skills.find((row) => row.id === id);
  if (!skill) return;
  await saveSkill({
    id,
    name: skill.name,
    languageKey: skill.languageKey,
    enabled: String(formData.get('enabled')) === '1',
  });
  revalidateAdmin();
}

export async function removeSkillAction(formData: FormData) {
  await requireAdmin();
  await deleteSkill(String(formData.get('id')));
  revalidateAdmin();
}

export async function upsertLevelAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '').trim() || undefined;
  await saveLevel({
    id,
    name: String(formData.get('name') ?? ''),
    band: String(formData.get('band') ?? 'EASY') as Difficulty,
  });
  revalidateAdmin();
  redirect('/admin/levels');
}

export async function removeLevelAction(formData: FormData) {
  await requireAdmin();
  await deleteLevel(String(formData.get('id')));
  revalidateAdmin();
}

export async function upsertTopicAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '').trim() || undefined;
  await saveTopic({
    id,
    name: String(formData.get('name') ?? ''),
  });
  revalidateAdmin();
  redirect('/admin/topics');
}

export async function removeTopicAction(formData: FormData) {
  await requireAdmin();
  await deleteTopic(String(formData.get('id')));
  revalidateAdmin();
}

export async function upsertCmsPageAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '').trim() || undefined;
  await saveCmsPage({
    id,
    title: String(formData.get('title') ?? ''),
    slug: String(formData.get('slug') ?? ''),
    body: String(formData.get('body') ?? ''),
    published: formData.get('published') === 'on',
  });
  revalidateAdmin();
  redirect('/admin/cms');
}

export async function removeCmsPageAction(formData: FormData) {
  await requireAdmin();
  await deleteCmsPage(String(formData.get('id')));
  revalidateAdmin();
}

export async function upsertFeedPostAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '').trim() || undefined;
  await saveFeedPost({
    id,
    kind: String(formData.get('kind') ?? 'post'),
    title: String(formData.get('title') ?? ''),
    body: String(formData.get('body') ?? ''),
    mediaUrl: String(formData.get('mediaUrl') ?? ''),
    linkUrl: String(formData.get('linkUrl') ?? ''),
    authorName: String(formData.get('authorName') ?? ''),
    published: formData.get('published') === 'on',
    blocks: String(formData.get('blocks') ?? ''),
  });
  revalidateAdmin();
  revalidatePath('/highlights');
  redirect('/admin/feed');
}

export async function removeFeedPostAction(formData: FormData) {
  await requireAdmin();
  await deleteFeedPost(String(formData.get('id')));
  revalidateAdmin();
}

export async function hideFeedCommentAction(formData: FormData) {
  await requireAdmin();
  const postId = String(formData.get('postId') ?? '');
  await setFeedCommentHidden(String(formData.get('commentId')), String(formData.get('hidden')) === '1');
  revalidatePath('/admin/feed');
  if (postId) revalidatePath(`/admin/feed/${postId}`);
}

export async function upsertNotificationAction(formData: FormData) {
  await requireAdmin();
  const channel = String(formData.get('channel') ?? 'email') as NotificationChannel;
  const id = String(formData.get('id') ?? '').trim() || undefined;
  await saveNotification({
    id,
    channel,
    title: String(formData.get('title') ?? ''),
    body: String(formData.get('body') ?? ''),
    audience: String(formData.get('audience') ?? 'all') as NotificationAudience,
    publish: formData.get('publish') === 'on' || String(formData.get('intent')) === 'publish',
  });
  revalidateAdmin();
  redirect(`/admin/notifications/${channel}/published`);
}

export async function saveDraftNotificationAction(formData: FormData) {
  await requireAdmin();
  const channel = String(formData.get('channel') ?? 'email') as NotificationChannel;
  const id = String(formData.get('id') ?? '').trim() || undefined;
  await saveNotification({
    id,
    channel,
    title: String(formData.get('title') ?? ''),
    body: String(formData.get('body') ?? ''),
    audience: String(formData.get('audience') ?? 'all') as NotificationAudience,
    publish: false,
  });
  revalidateAdmin();
  redirect(`/admin/notifications/${channel}/drafts`);
}

export async function removeNotificationAction(formData: FormData) {
  await requireAdmin();
  const channel = String(formData.get('channel') ?? 'email');
  await deleteNotification(String(formData.get('id')));
  revalidateAdmin();
  redirect(`/admin/notifications/${channel}/drafts`);
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  await saveSettings({
    siteName: String(formData.get('siteName') ?? ''),
    supportEmail: String(formData.get('supportEmail') ?? ''),
    maintenanceMessage: String(formData.get('maintenanceMessage') ?? ''),
  });
  revalidateAdmin();
  redirect('/admin/settings');
}
