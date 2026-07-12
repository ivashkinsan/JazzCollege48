import Database from 'better-sqlite3';
import path from 'path';
import { generateStaticData } from '../src/server/utils/generate-static-data.js';

const dbPath = path.resolve(process.cwd(), 'src/data/database.db');
const db = new Database(dbPath);

console.log('🚀 Starting duplicate content cleanup...');

let totalDeleted = 0;

try {
    // Find groups of duplicates based on title and date
    const duplicateGroups = db.prepare(`
        SELECT title, date, COUNT(id) as count, GROUP_CONCAT(id) as ids
        FROM content
        GROUP BY title, date
        HAVING COUNT(id) > 1
    `).all();

    if (duplicateGroups.length === 0) {
        console.log('✅ No duplicate entries found.');
    } else {
        console.log(`Found ${duplicateGroups.length} groups of duplicates.`);

        const deleteGalleryStmt = db.prepare('DELETE FROM gallery_images WHERE content_id = ?');
        const deleteContentStmt = db.prepare('DELETE FROM content WHERE id = ?');

        db.transaction(() => {
            for (const group of duplicateGroups) {
                const ids = (group.ids as string).split(',').map(Number).sort((a, b) => a - b);
                const originalId = ids.shift(); // Keep the first (oldest) ID
                
                console.log(`  -> Processing group "${group.title}". Keeping ID: ${originalId}. Deleting IDs: ${ids.join(', ')}.`);

                for (const idToDelete of ids) {
                    deleteGalleryStmt.run(idToDelete);
                    const info = deleteContentStmt.run(idToDelete);
                    totalDeleted += info.changes;
                }
            }
        })();

        console.log(`✅ Cleanup successful. A total of ${totalDeleted} duplicate entries were deleted.`);

        // Regenerate static data if changes were made
        if (totalDeleted > 0) {
            console.log('🔄 Regenerating static data...');
            // We need to await this, so wrap in an async IIFE
            (async () => {
                await generateStaticData();
                console.log('✅ Static data regenerated.');
            })();
        }
    }
} catch (error) {
    console.error('❌ Cleanup failed:', error);
} finally {
    db.close();
    console.log('🎉 Cleanup process finished.');
}
