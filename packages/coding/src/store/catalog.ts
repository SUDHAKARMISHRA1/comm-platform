/** Admin catalog CRUD. Prefers Supabase when persistence is enabled, otherwise the JSON file-store. */
import type {
  CatalogPayload,
  Difficulty,
  LanguageKey,
} from '../types';
import type {
  AdminSettingsRecord,
  CmsPageRecord,
  LevelRecord,
  NotificationAudience,
  NotificationCampaignRecord,
  NotificationChannel,
  QuestionRecord,
  SkillRecord,
  TopicRecord,
} from '../schema';
import { mutateStore, readStore } from './file-store';
import { isSupabasePersistenceEnabled } from './supabase-user-data';
import {
  catalogTablesReady,
  deleteLevelDb,
  deleteQuestionDb,
  deleteSkillDb,
  deleteTopicDb,
  listLevelsDb,
  listQuestionsDb,
  listSkillsDb,
  listTopicsDb,
  upsertLevelDb,
  upsertQuestionDb,
  upsertSkillDb,
  upsertTopicDb,
} from './supabase-catalog';

async function useCatalogDb() {
  if (!isSupabasePersistenceEnabled()) return false;
  return catalogTablesReady();
}

let catalogBackfillDone = false;

async function backfillCatalogIfEmpty() {
  if (catalogBackfillDone) return;
  const [skills, topics, levels, questions] = await Promise.all([
    listSkillsDb(),
    listTopicsDb(),
    listLevelsDb(),
    listQuestionsDb(),
  ]);
  if (skills.length || topics.length || levels.length || questions.length) {
    catalogBackfillDone = true;
    return;
  }
  const local = await readStore();
  for (const row of local.skills) await upsertSkillDb({ ...row, enabled: row.enabled !== false });
  for (const row of local.topics) await upsertTopicDb(row);
  for (const row of local.levels) await upsertLevelDb(row);
  for (const row of local.questions) await upsertQuestionDb(row);
  catalogBackfillDone = true;
}

export async function loadCatalogRecords() {
  if (await useCatalogDb()) {
    await backfillCatalogIfEmpty();
    const [skills, levels, topics, questions] = await Promise.all([
      listSkillsDb(),
      listLevelsDb(),
      listTopicsDb(),
      listQuestionsDb(),
    ]);
    return { skills, levels, topics, questions };
  }
  const data = await readStore();
  return {
    skills: [...data.skills],
    levels: [...data.levels],
    topics: [...data.topics],
    questions: [...data.questions],
  };
}

export async function persistQuestion(row: QuestionRecord) {
  if (await useCatalogDb()) {
    await upsertQuestionDb(row);
    return row;
  }
  return mutateStore((data) => {
    const idx = data.questions.findIndex((q) => q.id === row.id);
    if (idx >= 0) data.questions[idx] = row;
    else data.questions.push(row);
    return row;
  });
}

export async function removeQuestionRecord(id: number) {
  if (await useCatalogDb()) {
    await deleteQuestionDb(id);
    return true;
  }
  return mutateStore((data) => {
    data.questions = data.questions.filter((q) => q.id !== id);
    data.progress = data.progress.filter((p) => p.questionId !== id);
    data.interviewVotes = (data.interviewVotes ?? []).filter((v) => v.questionId !== id);
    data.voteCounts = (data.voteCounts ?? []).filter((v) => v.questionId !== id);
    return true;
  });
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function getCatalog(): Promise<CatalogPayload> {
  const { skills, levels, topics } = await loadCatalogRecords();
  const data = await readStore();
  return {
    skills: [...skills]
      .filter((s) => s.enabled !== false)
      .sort((a, b) => a.sequence - b.sequence)
      .map((s) => ({ id: s.id, name: s.name, slug: s.slug, languageKey: s.languageKey })),
    levels: [...levels]
      .filter((l) => l.enabled !== false)
      .sort((a, b) => a.sequence - b.sequence)
      .map((l) => ({ id: l.id, name: l.name, slug: l.slug, band: l.band })),
    topics: [...topics]
      .filter((t) => t.enabled !== false)
      .sort((a, b) => a.sequence - b.sequence)
      .map((t) => ({ id: t.id, name: t.name, slug: t.slug })),
    pages: data.cmsPages
      .filter((p) => p.published)
      .map((p) => ({ id: p.id, title: p.title, slug: p.slug, body: p.body })),
    notifications: data.notifications
      .filter((n) => n.status === 'published')
      .map((n) => ({
        id: n.id,
        channel: n.channel,
        title: n.title,
        body: n.body,
        audience: n.audience,
        publishedAt: n.publishedAt,
      })),
    settings: data.settings,
  };
}

export async function listSkills() {
  const { skills } = await loadCatalogRecords();
  return [...skills].sort((a, b) => a.sequence - b.sequence);
}

export async function listLevels() {
  const { levels } = await loadCatalogRecords();
  return [...levels].sort((a, b) => a.sequence - b.sequence);
}

export async function listTopics() {
  const { topics } = await loadCatalogRecords();
  return [...topics].sort((a, b) => a.sequence - b.sequence);
}

export async function saveSkill(input: {
  id?: string;
  name: string;
  languageKey?: string | null;
  enabled?: boolean;
}) {
  const now = new Date().toISOString();
  const languageKey = (input.languageKey as LanguageKey | null | undefined) || null;
  const { skills } = await loadCatalogRecords();

  if (input.id) {
    const row = skills.find((s) => s.id === input.id);
    if (!row) throw new Error('Skill not found');
    row.name = input.name.trim();
    row.slug = slugify(input.name);
    row.languageKey = languageKey;
    if (typeof input.enabled === 'boolean') row.enabled = input.enabled;
    row.updatedAt = now;
    if (await useCatalogDb()) return upsertSkillDb(row);
    return mutateStore((data) => {
      const local = data.skills.find((s) => s.id === row.id);
      if (local) Object.assign(local, row);
      return row;
    });
  }

  const row: SkillRecord = {
    id: `skill-${slugify(input.name)}-${Date.now()}`,
    name: input.name.trim(),
    slug: slugify(input.name),
    languageKey,
    sequence: skills.length + 1,
    enabled: input.enabled !== false,
    createdAt: now,
    updatedAt: now,
  };
  if (await useCatalogDb()) return upsertSkillDb(row);
  return mutateStore((data) => {
    data.skills.push(row);
    return row;
  });
}

export async function deleteSkill(id: string) {
  const { questions } = await loadCatalogRecords();
  if (questions.some((q) => q.skillId === id)) {
    throw new Error('Cannot delete a skill that is used by problems. Disable it instead.');
  }
  if (await useCatalogDb()) {
    await deleteSkillDb(id);
    return true;
  }
  return mutateStore((data) => {
    data.skills = data.skills.filter((s) => s.id !== id);
    return true;
  });
}

export async function saveLevel(input: { id?: string; name: string; band: Difficulty }) {
  const now = new Date().toISOString();
  const { levels, questions } = await loadCatalogRecords();
  if (input.id) {
    const row = levels.find((s) => s.id === input.id);
    if (!row) throw new Error('Level not found');
    row.name = input.name.trim();
    row.slug = slugify(input.name);
    row.band = input.band;
    row.updatedAt = now;
    const touched = questions.filter((q) => q.levelId === row.id);
    for (const q of touched) q.difficulty = row.band;
    if (await useCatalogDb()) {
      await upsertLevelDb(row);
      for (const q of touched) await upsertQuestionDb(q);
      return row;
    }
    return mutateStore((data) => {
      const local = data.levels.find((s) => s.id === row.id);
      if (local) Object.assign(local, row);
      for (const q of data.questions) {
        if (q.levelId === row.id) q.difficulty = row.band;
      }
      return row;
    });
  }
  const row: LevelRecord = {
    id: `level-${slugify(input.name)}-${Date.now()}`,
    name: input.name.trim(),
    slug: slugify(input.name),
    band: input.band,
    sequence: levels.length + 1,
    enabled: true,
    createdAt: now,
    updatedAt: now,
  };
  if (await useCatalogDb()) return upsertLevelDb(row);
  return mutateStore((data) => {
    data.levels.push(row);
    return row;
  });
}

export async function deleteLevel(id: string) {
  const { questions } = await loadCatalogRecords();
  if (questions.some((q) => q.levelId === id)) {
    throw new Error('Cannot delete a level that is used by problems.');
  }
  if (await useCatalogDb()) {
    await deleteLevelDb(id);
    return true;
  }
  return mutateStore((data) => {
    data.levels = data.levels.filter((s) => s.id !== id);
    return true;
  });
}

export async function saveTopic(input: { id?: string; name: string }) {
  const now = new Date().toISOString();
  const { topics, questions } = await loadCatalogRecords();
  if (input.id) {
    const row = topics.find((s) => s.id === input.id);
    if (!row) throw new Error('Topic not found');
    const previous = row.name;
    row.name = input.name.trim();
    row.slug = slugify(input.name);
    row.updatedAt = now;
    const touched = questions.filter((q) => q.topics.includes(previous));
    for (const q of touched) q.topics = q.topics.map((t) => (t === previous ? row.name : t));
    if (await useCatalogDb()) {
      await upsertTopicDb(row);
      for (const q of touched) await upsertQuestionDb(q);
      return row;
    }
    return mutateStore((data) => {
      const local = data.topics.find((s) => s.id === row.id);
      if (local) Object.assign(local, row);
      for (const q of data.questions) {
        q.topics = q.topics.map((t) => (t === previous ? row.name : t));
      }
      return row;
    });
  }
  const row: TopicRecord = {
    id: `topic-${slugify(input.name)}-${Date.now()}`,
    name: input.name.trim(),
    slug: slugify(input.name),
    sequence: topics.length + 1,
    enabled: true,
    createdAt: now,
    updatedAt: now,
  };
  if (await useCatalogDb()) return upsertTopicDb(row);
  return mutateStore((data) => {
    data.topics.push(row);
    return row;
  });
}

export async function deleteTopic(id: string) {
  const { topics, questions } = await loadCatalogRecords();
  const topic = topics.find((t) => t.id === id);
  const touched = topic ? questions.filter((q) => q.topics.includes(topic.name)) : [];
  for (const q of touched) q.topics = q.topics.filter((t) => t !== topic!.name);
  if (await useCatalogDb()) {
    await deleteTopicDb(id);
    for (const q of touched) await upsertQuestionDb(q);
    return true;
  }
  return mutateStore((data) => {
    data.topics = data.topics.filter((s) => s.id !== id);
    if (topic) {
      for (const q of data.questions) {
        q.topics = q.topics.filter((t) => t !== topic.name);
      }
    }
    return true;
  });
}

export async function listCmsPages() {
  const data = await readStore();
  return [...data.cmsPages].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function saveCmsPage(input: { id?: string; title: string; slug?: string; body: string; published: boolean }) {
  return mutateStore((data) => {
    const now = new Date().toISOString();
    if (input.id) {
      const row = data.cmsPages.find((p) => p.id === input.id);
      if (!row) throw new Error('Page not found');
      row.title = input.title.trim();
      row.slug = input.slug?.trim() || slugify(input.title);
      row.body = input.body;
      row.published = input.published;
      row.updatedAt = now;
      return row;
    }
    const row: CmsPageRecord = {
      id: `page-${Date.now()}`,
      title: input.title.trim(),
      slug: input.slug?.trim() || slugify(input.title),
      body: input.body,
      published: input.published,
      createdAt: now,
      updatedAt: now,
    };
    data.cmsPages.push(row);
    return row;
  });
}

export async function deleteCmsPage(id: string) {
  return mutateStore((data) => {
    data.cmsPages = data.cmsPages.filter((p) => p.id !== id);
    return true;
  });
}

export async function listNotifications(channel?: NotificationChannel, status?: 'draft' | 'published') {
  const data = await readStore();
  return data.notifications
    .filter((n) => (channel ? n.channel === channel : true) && (status ? n.status === status : true))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveNotification(input: {
  id?: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  audience: NotificationAudience;
  publish?: boolean;
}) {
  return mutateStore((data) => {
    const now = new Date().toISOString();
    if (input.id) {
      const row = data.notifications.find((n) => n.id === input.id);
      if (!row) throw new Error('Notification not found');
      row.title = input.title.trim();
      row.body = input.body;
      row.audience = input.audience;
      if (input.publish) {
        row.status = 'published';
        row.publishedAt = now;
      }
      return row;
    }
    const row: NotificationCampaignRecord = {
      id: `ntf-${Date.now()}`,
      channel: input.channel,
      title: input.title.trim(),
      body: input.body,
      audience: input.audience,
      status: input.publish ? 'published' : 'draft',
      createdAt: now,
      publishedAt: input.publish ? now : null,
    };
    data.notifications.unshift(row);
    return row;
  });
}

export async function deleteNotification(id: string) {
  return mutateStore((data) => {
    data.notifications = data.notifications.filter((n) => n.id !== id);
    return true;
  });
}

export async function getSettings() {
  const data = await readStore();
  return data.settings;
}

export async function saveSettings(input: AdminSettingsRecord) {
  return mutateStore((data) => {
    data.settings = {
      siteName: input.siteName.trim() || 'Comm Platform',
      supportEmail: input.supportEmail.trim(),
      maintenanceMessage: input.maintenanceMessage.trim(),
    };
    return data.settings;
  });
}
