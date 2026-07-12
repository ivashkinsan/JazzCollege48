import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { generateStaticData } from '../src/server/utils/generate-static-data.js';

const dbPath = path.resolve(process.cwd(), 'src/data/database.db');
const db = new Database(dbPath);

console.log('🚀 Starting gallery images cleanup...');

const images = db.prepare('SELECT id, src FROM gallery_images').all();
let deletedCount = 0;

const deleteStmt = db.prepare('DELETE FROM gallery_images WHERE id = ?');

for (const image of images) {
    // Correctly resolve the absolute path to the file
    // The DB stores paths like /media/2023/...
    const filePath = path.join(process.cwd(), 'public', image.src);
    
    if (!fs.existsSync(filePath)) {
        console.log(`  -> Deleting broken entry: ${image.src}`);
        deleteStmt.run(image.id);
        deletedCount++;
    }
}

db.close();

if (deletedCount > 0) {
    console.log(`🎉 Cleanup complete. Deleted ${deletedCount} broken entries.`);
    console.log('🔄 Regenerating static data...');
    await generateStaticData();
    console.log('✅ Static data regenerated.');
} else {
    console.log('✅ No broken entries found.');
}
