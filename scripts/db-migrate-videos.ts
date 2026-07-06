import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../src/data/database.db');
const videosDataPath = path.resolve(__dirname, '../src/data/static/videos.ts');
const db = new Database(dbPath);

console.log('🚀 Migrating "videos" data to SQLite...');

try {
    // 1. Read the data file as text
    const fileContent = fs.readFileSync(videosDataPath, 'utf-8');

    // 2. Extract the array literal string using a regex
    const arrayRegex = /export const videos: Video\[\] = (\[[\s\S]*?\]);/s;
    const match = fileContent.match(arrayRegex);
    if (!match || !match[1]) {
        throw new Error('Could not find the videos array in the data file.');
    }
    const arrayString = match[1];

    // 3. Evaluate the string to get the videos array object
    const videos = eval('(' + arrayString + ')');
    console.log(`   - Found ${videos.length} video entries in the source file.`);

    // 4. Proceed with migration
    db.exec('DELETE FROM videos');
    db.exec("DELETE FROM sqlite_sequence WHERE name = 'videos';");
    console.log('   - Cleared existing videos data.');

    const insertStmt = db.prepare(`
        INSERT INTO videos (legacy_id, title, description, video_url, date, source)
        VALUES (@legacy_id, @title, @description, @video_url, @date, @source)
    `);

    let migratedCount = 0;
    db.transaction(() => {
        for (const video of videos) {
            insertStmt.run({
                legacy_id: video.id,
                title: video.title,
                description: video.description,
                video_url: video.videoUrl,
                date: video.date,
                source: video.source,
            });
            migratedCount++;
        }
    })();
    
    console.log(`✅ Migrated ${migratedCount} video entries.`);

} catch (error) {
    console.error('❌ Failed to migrate videos:', error);
} finally {
    db.close();
    console.log('🎉 Videos migration process finished.');
}
