import {
  getQuestionRecord,
  listPracticeSets,
  listQuestionsAdmin,
} from '@comm-platform/coding';

/** Server-only data loaders for admin RSC pages. Not server actions. */
export async function loadPracticeSets() {
  return listPracticeSets();
}

export async function loadPracticeSetWithQuestions(setId: string) {
  const sets = await listPracticeSets();
  const set = sets.find((s) => s.id === setId);
  if (!set) return null;
  const questions = await listQuestionsAdmin(setId);
  return { set, questions };
}

export async function loadQuestionForAdmin(setId: string, questionId: number) {
  const q = await getQuestionRecord(questionId);
  if (!q || q.practiceSetId !== setId) return null;
  return q;
}
