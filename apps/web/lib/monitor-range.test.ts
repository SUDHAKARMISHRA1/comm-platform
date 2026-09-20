import { describe, expect, it } from 'vitest';

import { bucketKey, fillBuckets, healthFromFailures, resolveMonitorRange } from './monitor-range';

describe('resolveMonitorRange', () => {
  it('uses a calendar day when day is set', () => {
    const range = resolveMonitorRange({ day: '2026-09-20' });
    expect(range.grain).toBe('hour');
    expect(range.label).toBe('2026-09-20');
  });

  it('lets a month/year filter apply when the rolling range is custom', () => {
    const range = resolveMonitorRange({ range: '', month: '9', year: '2026' });
    expect(range.label).toBe('2026-09');
    expect(range.grain).toBe('day');
  });

  it('defaults to the last 7 days', () => {
    const range = resolveMonitorRange({});
    expect(range.label).toBe('Last 7 days');
    expect(range.grain).toBe('day');
  });
});

describe('fillBuckets', () => {
  it('counts failures into day buckets', () => {
    const start = new Date('2026-09-18T00:00:00');
    const end = new Date('2026-09-20T23:59:59');
    const rows = [
      { createdAt: '2026-09-18T10:00:00' },
      { createdAt: '2026-09-18T12:00:00' },
      { createdAt: '2026-09-20T08:00:00' },
    ].map((row, index) => ({
      id: String(index),
      userId: null,
      method: 'GET',
      path: '/feed',
      statusCode: 500,
      errorCode: null,
      errorMessage: 'fail',
      requestId: null,
      clientPlatform: 'web',
      appVersion: null,
      userAgent: null,
      pagePath: null,
      metadata: {},
      createdAt: row.createdAt,
    }));
    const buckets = fillBuckets(rows, start, end, 'day');
    expect(buckets.find((item) => item.label === bucketKey(new Date('2026-09-18T00:00:00'), 'day'))?.count).toBe(2);
    expect(buckets.find((item) => item.label === bucketKey(new Date('2026-09-19T00:00:00'), 'day'))?.count).toBe(0);
    expect(buckets.find((item) => item.label === bucketKey(new Date('2026-09-20T00:00:00'), 'day'))?.count).toBe(1);
  });
});

describe('healthFromFailures', () => {
  it('is healthy with no recent failures', () => {
    expect(healthFromFailures([], Date.parse('2026-09-20T12:00:00Z')).label).toBe('Healthy');
  });
});
