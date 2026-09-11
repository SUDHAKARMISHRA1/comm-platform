/**
 * NOT SQL. Do not paste this file into the Supabase SQL editor.
 * Rebuilds supabase/seeds/001_java_practice_pack.sql
 *
 * Rebuild: node scripts/generate-java-practice-sql.mjs
 */
import { writePracticePackSql } from './lib/write-practice-sql.mjs';

writePracticePackSql({
  label: 'Java',
  language: 'java',
  skillId: 'skill-java',
  skillSlug: 'java',
  skillSequence: 1,
  practiceSetId: 'ps-skill-java',
  idBase: 100,
  sqlFile: '001_java_practice_pack.sql',
  template: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
    }
}`,
});
