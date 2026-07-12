import Database from 'better-sqlite3';
import path from 'path';

// --- Configuration ---
const dbPath = path.resolve(process.cwd(), 'src/data/database.db');
const db = new Database(dbPath);

console.log('🚀 Starting Subcategory Backfill...');

let updatedCount = 0;

try {
    const updateStmt = db.prepare(`
        UPDATE content 
        SET subcategory = 'разное' 
        WHERE category = 'news' AND (subcategory IS NULL OR subcategory = '' OR subcategory = 'null')
    `);

    const info = updateStmt.run();
    updatedCount = info.changes;

    console.log(`✅ Backfill successful. ${updatedCount} entries were updated to 'разное'.`);
    
} catch (error) {
    console.error('❌ Backfill failed:', error);
} finally {
    db.close();
    console.log('🎉 Backfill process finished.');
}
