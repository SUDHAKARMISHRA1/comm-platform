/**
 * NOT SQL. Do not paste this file into the Supabase SQL editor.
 * Rebuilds supabase/seeds/003_cpp_practice_pack.sql — that .sql file is what you run in Supabase.
 *
 * Rebuild: node scripts/generate-cpp-practice-sql.mjs
 */
import { writePracticePackSql } from './lib/write-practice-sql.mjs';

writePracticePackSql({
  label: 'C++',
  language: 'cpp',
  skillId: 'skill-cpp',
  skillSlug: 'cpp',
  skillSequence: 3,
  practiceSetId: 'ps-skill-cpp',
  idBase: 300,
  sqlFile: '003_cpp_practice_pack.sql',
  template: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    return 0;
}`,
});
