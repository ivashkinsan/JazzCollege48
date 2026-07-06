import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../src/data/database.db');
const achievementsDataPath = path.resolve(__dirname, '../src/data/static/achievements.ts');

const db = new Database(dbPath);

console.log('🚀 Migrating "achievements" data to SQLite...');

try {
    // 1. Read the data file as text
    const fileContent = fs.readFileSync(achievementsDataPath, 'utf-8');

    // 2. Extract the array literal string using a regex
    const arrayRegex = /export const achievements: Achievement\[\] = (\[[\s\S]*?\]);/s;
    const match = fileContent.match(arrayRegex);
    if (!match || !match[1]) {
        throw new Error('Could not find the achievements array in the data file.');
    }
    let arrayString = match[1];

    // 3. The file contains `asset("/path")` calls. We need to turn these into strings for eval.
    // Replace `asset("...")` with `"..."`
    arrayString = arrayString.replace(/asset\s*\(\s*(".*?")\s*\)/g, '$1');

    // 4. Evaluate the string to get the achievements array object
    const achievements = eval('(' + arrayString + ')');
    console.log(`   - Found ${achievements.length} achievement entries in the source file.`);

    // 5. Proceed with migration
    db.exec('DELETE FROM achievements');
    db.exec("DELETE FROM sqlite_sequence WHERE name = 'achievements';");
    console.log('   - Cleared existing achievements data.');

    const insertStmt = db.prepare(`
        INSERT INTO achievements (legacy_id, title, student_name, competition, date, place, category, image_src)
        VALUES (@legacy_id, @title, @student_name, @competition, @date, @place, @category, @image_src)
    `);

    let migratedCount = 0;
    db.transaction(() => {
        for (const achievement of achievements) {
            insertStmt.run({
                legacy_id: achievement.id,
                title: achievement.title,
                student_name: achievement.studentName,
                competition: achievement.competition,
                date: achievement.date,
                place: achievement.place,
                category: achievement.category,
                image_src: achievement.image,
            });
            migratedCount++;
        }
    })();
    
    console.log(`✅ Migrated ${migratedCount} achievement entries.`);

} catch (error) {
    console.error('❌ Failed to migrate achievements:', error);
} finally {
    db.close();
    console.log('🎉 Achievements migration process finished.');
}
