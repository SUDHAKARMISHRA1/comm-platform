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
  SkillRecord,
  TopicRecord,
} from '../schema';
import { mutateStore, readStore } from './file-store';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function getCatalog(): Promise<CatalogPayload> {
  const data = await readStore();
  return {
    skills: [...data.skills]
      .sort((a, b) => a.sequence - b.sequence)
      .map((s) => ({ id: s.id, name: s.name, slug: s.slug, languageKey: s.languageKey })),
    levels: [...data.levels]
      .sort((a, b) => a.sequence - b.sequence)
      .map((l) => ({ id: l.id, name: l.name, slug: l.slug, band: l.band })),
    topics: [...data.topics]
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
  const data = await readStore();
  return [...data.skills].sort((a, b) => a.sequence - b.sequence);
}

export async function listLevels() {
  const data = await readStore();
  return [...data.levels].sort((a, b) => a.sequence - b.sequence);
}

export async function listTopics() {
  const data = await readStore();
  return [...data.topics].sort((a, b) => a.sequence - b.sequence);
}

export async function saveSkill(input: { id?: string; name: string; languageKey?: string | null }) {
  return mutateStore((data) => {
    const now = new Date().toISOString();
    const languageKey = (input.languageKey as LanguageKey | null | undefined) || null;
    if (input.id) {
      const row = data.skills.find((s) => s.id === input.id);
      if (!row) throw new Error('Skill not found');
      row.name = input.name.trim();
      row.slug = slugify(input.name);
      row.languageKey = languageKey;
      row.updatedAt = now;
      return row;
    }
    const row: SkillRecord = {
      id: `skill-${slugify(input.name)}-${Date.now()}`,
      name: input.name.trim(),
      slug: slugify(input.name),
      languageKey,
      sequence: data.skills.length + 1,
      createdAt: now,
      updatedAt: now,
    };
    data.skills.push(row);
    return row;
  });
}

export async function deleteSkill(id: string) {
  return mutateStore((data) => {
    if (data.questions.some((q) => q.skillId === id)) {
      throw new Error('Cannot delete a skill that is used by problems.');
    }
    data.skills = data.skills.filter((s) => s.id !== id);
    return true;
  });
}

export async function saveLevel(input: { id?: string; name: string; band: Difficulty }) {
  return mutateStore((data) => {
    const now = new Date().toISOString();
    if (input.id) {
      const row = data.levels.find((s) => s.id === input.id);
      if (!row) throw new Error('Level not found');
      row.name = input.name.trim();
      row.slug = slugify(input.name);
      row.band = input.band;
      row.updatedAt = now;
      for (const q of data.questions) {
        if (q.levelId === row.id) q.difficulty = row.band;
      }
      return row;
    }
    const row: LevelRecord = {
      id: `level-${slugify(input.name)}-${Date.now()}`,
      name: input.name.trim(),
      slug: slugify(input.name),
      band: input.band,
      sequence: data.levels.length + 1,
      createdAt: now,
      updatedAt: now,
    };
    data.levels.push(row);
    return row;
  });
}

export async function deleteLevel(id: string) {
  return mutateStore((data) => {
    if (data.questions.some((q) => q.levelId === id)) {
      throw new Error('Cannot delete a level that is used by problems.');
    }
    data.levels = data.levels.filter((s) => s.id !== id);
    return true;
  });
}

export async function saveTopic(input: { id?: string; name: string }) {
  return mutateStore((data) => {
    const now = new Date().toISOString();
    if (input.id) {
      const row = data.topics.find((s) => s.id === input.id);
      if (!row) throw new Error('Topic not found');
      const previous = row.name;
      row.name = input.name.trim();
      row.slug = slugify(input.name);
      row.updatedAt = now;
      for (const q of data.questions) {
        q.topics = q.topics.map((t) => (t === previous ? row.name : t));
      }
      return row;
    }
    const row: TopicRecord = {
      id: `topic-${slugify(input.name)}-${Date.now()}`,
      name: input.name.trim(),
      slug: slugify(input.name),
      sequence: data.topics.length + 1,
      createdAt: now,
      updatedAt: now,
    };
    data.topics.push(row);
    return row;
  });
}

export async function deleteTopic(id: string) {
  return mutateStore((data) => {
    const topic = data.topics.find((t) => t.id === id);
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
