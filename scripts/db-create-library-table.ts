import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../src/data/database.db');
const db = new Database(dbPath);

console.log('🚀 Checking for "library_links" table...');

try {
    const createLibraryLinksTable = `
    CREATE TABLE IF NOT EXISTS library_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        url TEXT NOT NULL,
        category TEXT NOT NULL
    );
    `;
    db.exec(createLibraryLinksTable);
    console.log('✅ Table "library_links" created or already exists.');
} catch (error) {
    console.error('❌ Failed to create "library_links" table:', error);
} finally {
    db.close();
    console.log('🎉 Database schema check finished.');
}
