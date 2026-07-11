import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../src/data/database.db');
const manifestPath = path.resolve(__dirname, '../src/data/media-manifest.json');
const publicRoot = path.resolve(__dirname, '..', 'public');

const db = new Database(dbPath);

function parseMarkdownBody(content: string): string {
    const cleanedContent = content.replace(/^\uFEFF/, '');
    const parts = cleanedContent.split('---');
    if (parts.length < 3) {
        return content; // Fallback for files without frontmatter
    }
    return parts.slice(2).join('---').trim();
}

async function migrate() {
    console.log('🚀 Starting content migration from Markdown files to SQLite...');

    // Clear existing data to make the script idempotent
    console.log('   - Clearing existing content...');
    db.exec('DELETE FROM gallery_images');
    db.exec('DELETE FROM content');
    db.exec('DELETE FROM sqlite_sequence WHERE name IN (\'content\', \'gallery_images\');'); // Reset autoincrement

    const insertContentStmt = db.prepare(`
        INSERT INTO content (slug, title, date, category, time, venue, tags, body, cover_image_src)
        VALUES (@slug, @title, @date, @category, @time, @venue, @tags, @body, @cover_image_src)
    `);

    const insertGalleryImageStmt = db.prepare(`
        INSERT INTO gallery_images (content_id, src, title)
        VALUES (@content_id, @src, @title)
    `);

    let manifest = [];
    try {
        manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    } catch (error) {
        console.error('❌ Could not read the manifest file. Aborting migration.', error);
        return;
    }

    let migratedCount = 0;
    for (const album of manifest) {
        try {
            const year = new Date(album.albumDate).getFullYear();
            if (isNaN(year)) {
                 console.warn(`   - Skipping album with invalid date: "${album.albumTitle}"`);
                 continue;
            }

            // A more robust way to get the slug, handling malformed albumIds
            const slug = album.albumId.replace(/-\d{4}$/, '').replace(/-\d{4}-\d{2}-\d{2}$/, '');

            let body = '';
            // A more robust way to find the .md file
            if (album.photos && album.photos.length > 0) {
                const photoDir = path.dirname(album.photos[0].src);
                const fullDirPath = path.join(publicRoot, photoDir);

                try {
                    const filesInDir = await fs.readdir(fullDirPath);
                    const mdFileName = filesInDir.find(f => f.endsWith('.md'));

                    if (mdFileName) {
                        const mdFilePath = path.join(fullDirPath, mdFileName);
                        const rawContent = await fs.readFile(mdFilePath, 'utf-8');
                        body = parseMarkdownBody(rawContent);
                    } else {
                         console.warn(`   - .md file not found in ${photoDir} for "${album.albumTitle}". Body will be empty.`);
                    }
                } catch (dirError) {
                     console.warn(`   - Could not read directory for "${album.albumTitle}". Body will be empty. Path: ${fullDirPath}`);
                }
            } else {
                console.warn(`   - No photos found for "${album.albumTitle}", cannot determine file path. Body will be empty.`);
            }

            const coverImage = album.photos.find((p: any) => p.id.includes('_01')) || album.photos[0];

            const result = insertContentStmt.run({
                slug: slug,
                title: album.albumTitle,
                date: album.albumDate,
                category: Array.isArray(album.albumCategory) ? album.albumCategory.join(', ') : album.albumCategory,
                time: album.time || null,
                venue: album.venue || null,
                tags: album.tags ? JSON.stringify(album.tags) : JSON.stringify([]),
                body: body,
                cover_image_src: coverImage ? coverImage.src : null
            });

            const newContentId = result.lastInsertRowid;

            for (const photo of album.photos) {
                insertGalleryImageStmt.run({
                    content_id: newContentId,
                    src: photo.src,
                    title: photo.title
                });
            }
            migratedCount++;
            console.log(`  -> Migrated "${album.albumTitle}"`);

        } catch (error) {
            console.error(`❌ Failed to migrate album: "${album.albumTitle}"`, error);
        }
    }

    db.close();
    console.log(`🎉 Migration complete. Migrated ${migratedCount} content entries.`);
}

migrate().catch(console.error);
