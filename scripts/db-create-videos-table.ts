import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../src/data/database.db');
const db = new Database(dbPath);

console.log('🚀 Checking for "videos" table...');

try {
    const createVideosTable = `
    CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        legacy_id TEXT,
        title TEXT NOT NULL,
        description TEXT,
        video_url TEXT NOT NULL,
        date TEXT NOT NULL,
        source TEXT
    );
    `;
    db.exec(createVideosTable);
    console.log('✅ Table "videos" created or already exists.');
} catch (error) {
    console.error('❌ Failed to create "videos" table:', error);
} finally {
    db.close();
    console.log('🎉 Database schema check finished.');
}
