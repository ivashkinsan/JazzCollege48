import Database from 'better-sqlite3';
import path from 'path';

// --- Configuration ---
const dbPath = path.resolve(process.cwd(), 'src/data/database.db');
const db = new Database(dbPath);

console.log('🚀 Starting Database Migration: Merging "photoalbum" into "news"...');

try {
    // Begin a transaction
    db.transaction(() => {
        const updateStmt = db.prepare(`
            UPDATE content 
            SET category = 'news' 
            WHERE category = 'photoalbum'
        `);

        const info = updateStmt.run();
        console.log(`✅ Migration successful. ${info.changes} entries were updated.`);
        
        // Optional: Verify that there are no 'photoalbum' entries left
        const verificationStmt = db.prepare(`
            SELECT COUNT(*) as count 
            FROM content 
            WHERE category = 'photoalbum'
        `);
        const result = verificationStmt.get() as { count: number };
        if (result.count === 0) {
            console.log('✅ Verification successful: No entries with category "photoalbum" found.');
        } else {
            console.warn(`⚠️ Verification failed: ${result.count} entries with category "photoalbum" still exist.`);
        }
    })();
} catch (error) {
    console.error('❌ Migration failed:', error);
} finally {
    db.close();
    console.log('🎉 Migration process finished.');
}
