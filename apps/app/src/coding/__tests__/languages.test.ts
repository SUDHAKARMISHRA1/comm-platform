import { describe, expect, it } from 'vitest';

import { LANGUAGES } from '@comm-platform/coding';

describe('language config', () => {
  it('has java, c, cpp templates', () => {
    expect(LANGUAGES.java.template).toContain('public class Main');
    expect(LANGUAGES.c.template).toContain('#include');
    expect(LANGUAGES.cpp.template).toContain('bits/stdc++.h');
  });

  it('keeps judge0 ids in config only', () => {
    expect(LANGUAGES.java.judge0LanguageId).toBe(62);
  });
});
