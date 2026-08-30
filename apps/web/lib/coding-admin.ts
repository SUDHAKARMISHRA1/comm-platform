import {
  listLevels,
  listPracticeSets,
  listQuestionsAdmin,
  listSkills,
  listTopics,
  getQuestionRecord,
} from '@comm-platform/coding/server';

/** Server-only data loaders for admin RSC pages. Not server actions. */
export async function loadPracticeSets() {
  return listPracticeSets();
}

export async function loadCatalog() {
  const [skills, levels, topics] = await Promise.all([listSkills(), listLevels(), listTopics()]);
  return { skills, levels, topics };
}

export async function loadPracticeSetWithQuestions(setId: string) {
  const sets = await listPracticeSets();
  const set = sets.find((s) => s.id === setId);
  if (!set) return null;
  const [questions, catalog] = await Promise.all([listQuestionsAdmin(setId), loadCatalog()]);
  return { set, questions, ...catalog };
}

export async function loadQuestionForAdmin(setId: string, questionId: number) {
  const q = await getQuestionRecord(questionId);
  if (!q || q.practiceSetId !== setId) return null;
  const catalog = await loadCatalog();
  return { question: q, ...catalog };
}
