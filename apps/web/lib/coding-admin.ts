import {
  listLevels,
  listPracticeSets,
  listQuestionsAdmin,
  listSkills,
  listTopics,
  getQuestionRecord,
  getQuestionSolveStats,
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
  if (!q) return null;
  if (q.practiceSetId && q.practiceSetId !== setId && setId !== q.skillId) return null;
  const catalog = await loadCatalog();
  return { question: q, ...catalog };
}

export async function loadSkillProblems(skillId: string, levelId?: string) {
  const skills = await listSkills();
  const skill = skills.find((row) => row.id === skillId);
  if (!skill) return null;
  const [questions, catalog, stats] = await Promise.all([
    listQuestionsAdmin({ skillId, levelId: levelId || undefined }),
    loadCatalog(),
    getQuestionSolveStats(),
  ]);
  return { skill, questions, stats, ...catalog };
}
