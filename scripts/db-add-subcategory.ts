import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../src/data/database.db');
const db = new Database(dbPath);

console.log('🚀 Altering "content" table to add "subcategory" column...');

try {
    // Check if the column already exists to make the script re-runnable
    const columns = db.pragma('table_info(content)');
    const columnExists = columns.some((col: any) => col.name === 'subcategory');

    if (!columnExists) {
        const alterStmt = `ALTER TABLE content ADD COLUMN subcategory TEXT`;
        db.exec(alterStmt);
        console.log('✅ Column "subcategory" added successfully.');
    } else {
        console.log('ℹ️ Column "subcategory" already exists.');
    }
} catch (error) {
    console.error('❌ Failed to alter table:', error);
} finally {
    db.close();
    console.log('🎉 Database schema update process finished.');
}
