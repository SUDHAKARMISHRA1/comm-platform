import { describe, expect, it } from 'vitest';

import { buildWeeklyActivity } from './weekly-activity';

describe('buildWeeklyActivity', () => {
  it('counts submissions for the last seven local days', () => {
    const now = new Date(2026, 8, 4, 15, 0, 0);
    const days = buildWeeklyActivity(
      [
        { createdAt: new Date(2026, 8, 4, 9, 0, 0).toISOString() },
        { createdAt: new Date(2026, 8, 4, 18, 0, 0).toISOString() },
        { createdAt: new Date(2026, 8, 2, 12, 0, 0).toISOString() },
        { createdAt: new Date(2026, 7, 20, 12, 0, 0).toISOString() },
      ],
      now,
    );

    expect(days).toHaveLength(7);
    expect(days[0]?.day).toBe('Sat');
    expect(days[6]?.day).toBe('Fri');
    expect(days[6]?.count).toBe(2);
    expect(days[4]?.count).toBe(1);
    expect(days.reduce((sum, day) => sum + day.count, 0)).toBe(3);
  });
});
