/**
 * NOT SQL. Do not paste this file into the Supabase SQL editor.
 * Rebuilds supabase/seeds/002_c_practice_pack.sql — that .sql file is what you run in Supabase.
 *
 * Rebuild: node scripts/generate-c-practice-sql.mjs
 */
import { writePracticePackSql } from './lib/write-practice-sql.mjs';

writePracticePackSql({
  label: 'C',
  language: 'c',
  skillId: 'skill-c',
  skillSlug: 'c',
  skillSequence: 2,
  practiceSetId: 'ps-skill-c',
  idBase: 200,
  sqlFile: '002_c_practice_pack.sql',
  template: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    
    return 0;
}`,
});
