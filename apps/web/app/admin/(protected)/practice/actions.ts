'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  deletePracticeSet,
  deleteQuestion,
  getQuestionRecord,
  listPracticeSets,
  listQuestionsAdmin,
  reorderQuestions,
  reorderPracticeSets,
  savePracticeSet,
  saveQuestion,
} from '@comm-platform/coding/server';
import type { Difficulty, LanguageKey } from '@comm-platform/coding';

import { requireAdmin } from '@/lib/require-admin';

export async function upsertPracticeSet(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '').trim() || undefined;
  await savePracticeSet({
    ...(id ? { id } : {}),
    title: String(formData.get('title') ?? ''),
    slug: String(formData.get('slug') ?? ''),
    description: String(formData.get('description') ?? ''),
    topics: String(formData.get('topics') ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    languages: String(formData.get('languages') ?? 'java,c,cpp')
      .split(',')
      .map((l) => l.trim() as LanguageKey),
    sequence: Number(formData.get('sequence') ?? '1'),
    published: formData.get('published') === 'on',
  });
  revalidatePath('/admin/practice');
}

export async function removePracticeSet(setId: string) {
  await requireAdmin();
  await deletePracticeSet(setId);
  revalidatePath('/admin/practice');
}

export async function movePracticeSet(setId: string, direction: 'up' | 'down') {
  await requireAdmin();
  const sets = await listPracticeSets();
  const idx = sets.findIndex((s) => s.id === setId);
  if (idx < 0) return;
  const swap = direction === 'up' ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= sets.length) return;
  const ids = sets.map((s) => s.id);
  [ids[idx], ids[swap]] = [ids[swap]!, ids[idx]!];
  await reorderPracticeSets(ids);
  revalidatePath('/admin/practice');
}

export async function upsertQuestion(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id') ?? '0') || undefined;
  const practiceSetId = String(formData.get('practiceSetId') ?? '');
  const testCasesRaw = String(formData.get('testCases') ?? '[]');
  const testCases = JSON.parse(testCasesRaw) as {
    id: string;
    input: string;
    expectedOutput: string;
    hidden: boolean;
    sequence: number;
  }[];

  const topicNames = formData.getAll('topicName').map(String).filter(Boolean);
  const topics = topicNames.length
    ? topicNames
    : String(formData.get('topics') ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
  const languageChecks = formData.getAll('language').map((v) => String(v).trim() as LanguageKey).filter(Boolean);
  const supportedLanguages = languageChecks.length
    ? languageChecks
    : String(formData.get('supportedLanguages') ?? 'java,c,cpp')
        .split(',')
        .map((l) => l.trim() as LanguageKey);

  const saved = await saveQuestion({
    id,
    practiceSetId,
    sequence: Number(formData.get('sequence') ?? '1'),
    title: String(formData.get('title') ?? ''),
    slug: String(formData.get('slug') ?? ''),
    difficulty: String(formData.get('difficulty') ?? 'EASY') as Difficulty,
    description: String(formData.get('description') ?? ''),
    inputFormat: String(formData.get('inputFormat') ?? ''),
    outputFormat: String(formData.get('outputFormat') ?? ''),
    constraints: String(formData.get('constraints') ?? ''),
    examples: JSON.parse(String(formData.get('examples') ?? '[]')),
    topics,
    skillId: String(formData.get('skillId') ?? ''),
    levelId: String(formData.get('levelId') ?? ''),
    supportedLanguages,
    codeTemplates: JSON.parse(String(formData.get('codeTemplates') ?? '{}')),
    testCases,
    published: formData.get('published') === 'on',
  });
  revalidatePath('/admin/practice');
  revalidatePath('/admin/skills');
  if (saved.skillId) revalidatePath(`/admin/skills/${saved.skillId}`);
  if (practiceSetId) revalidatePath(`/admin/practice/${practiceSetId}`);
  if (id) {
    if (practiceSetId) revalidatePath(`/admin/practice/${practiceSetId}/questions/${id}`);
    if (saved.skillId) revalidatePath(`/admin/skills/${saved.skillId}/questions/${id}`);
  }
  if (saved.skillId) redirect(`/admin/skills/${saved.skillId}`);
}

export async function removeQuestion(questionId: number, setId: string) {
  await requireAdmin();
  await deleteQuestion(questionId);
  revalidatePath(`/admin/practice/${setId}`);
}

async function moveQuestion(setId: string, questionId: number, direction: 'up' | 'down') {
  const questions = await listQuestionsAdmin(setId);
  const idx = questions.findIndex((q) => q.id === questionId);
  if (idx < 0) return;
  const swap = direction === 'up' ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= questions.length) return;
  const ids = questions.map((q) => q.id);
  [ids[idx], ids[swap]] = [ids[swap]!, ids[idx]!];
  await reorderQuestions(setId, ids);
}

export async function movePracticeSetUp(formData: FormData) {
  await requireAdmin();
  await movePracticeSet(String(formData.get('setId')), 'up');
  revalidatePath('/admin/practice');
}

export async function movePracticeSetDown(formData: FormData) {
  await requireAdmin();
  await movePracticeSet(String(formData.get('setId')), 'down');
  revalidatePath('/admin/practice');
}

export async function removePracticeSetAction(formData: FormData) {
  await requireAdmin();
  await deletePracticeSet(String(formData.get('setId')));
  revalidatePath('/admin/practice');
}

export async function moveQuestionUp(formData: FormData) {
  await requireAdmin();
  const setId = String(formData.get('setId'));
  await moveQuestion(setId, Number(formData.get('questionId')), 'up');
  revalidatePath(`/admin/practice/${setId}`);
}

export async function moveQuestionDown(formData: FormData) {
  await requireAdmin();
  const setId = String(formData.get('setId'));
  await moveQuestion(setId, Number(formData.get('questionId')), 'down');
  revalidatePath(`/admin/practice/${setId}`);
}

export async function removeQuestionAction(formData: FormData) {
  await requireAdmin();
  const setId = String(formData.get('setId'));
  const skillId = String(formData.get('skillId') ?? '');
  await deleteQuestion(Number(formData.get('questionId')));
  if (setId) revalidatePath(`/admin/practice/${setId}`);
  if (skillId) revalidatePath(`/admin/skills/${skillId}`);
  revalidatePath('/admin/skills');
}

export async function toggleQuestionPublishedAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('questionId'));
  const question = await getQuestionRecord(id);
  if (!question) return;
  await saveQuestion({
    ...question,
    published: String(formData.get('published')) === '1',
  });
  revalidatePath('/admin/skills');
  revalidatePath(`/admin/skills/${question.skillId}`);
  if (question.practiceSetId) revalidatePath(`/admin/practice/${question.practiceSetId}`);
}
