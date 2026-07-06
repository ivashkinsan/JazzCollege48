import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../src/data/database.db');
const db = new Database(dbPath);

console.log('🚀 Checking for "achievements" table...');

try {
    const createAchievementsTable = `
    CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        legacy_id TEXT,
        title TEXT NOT NULL,
        student_name TEXT,
        competition TEXT NOT NULL,
        date TEXT NOT NULL,
        place TEXT,
        category TEXT,
        image_src TEXT
    );
    `;
    db.exec(createAchievementsTable);
    // Add new column 'city' if it doesn't exist, gracefully handling if it already does
    try {
        db.exec(`
            ALTER TABLE achievements ADD COLUMN city TEXT;
        `);
        console.log('✅ Column "city" added to "achievements" table.');
    } catch (e: any) {
        if (e.message.includes('duplicate column name: city')) {
            console.log('ℹ️ Column "city" already exists in "achievements" table, skipping.');
        } else {
            console.error('❌ Failed to add "city" column to "achievements" table:', e);
        }
    }
    console.log('✅ Table "achievements" created or already exists.');
} catch (error) {
    console.error('❌ Failed to create "achievements" table:', error);
} finally {
    db.close();
    console.log('🎉 Database schema check finished.');
}
