import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../src/data/database.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

const manifestPath = path.resolve(__dirname, '../src/data/media-manifest.json');

interface Photo {
    id: string;
    src: string;
    title: string;
}

interface PhotoAlbum {
    albumId: string;
    albumTitle: string;
    albumDate: string;
    albumCategory: string; // This will be mapped to 'photoalbum' category in DB
    photos: Photo[];
}

function createSlug(text: string): string {
    if (!text) return '';
    const a: Record<string, string> = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'с','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'};
    return text.toLowerCase().split('').map(char => a[char] || char).join('').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function migratePhotoAlbums() {
    console.log('Starting photo album migration...');

    try {
        const manifestContent = await fs.readFile(manifestPath, 'utf8');
        const albums: PhotoAlbum[] = JSON.parse(manifestContent);

        const insertContentStmt = db.prepare(`
            INSERT INTO content (slug, title, date, category, body, cover_image_src)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        const insertGalleryImageStmt = db.prepare(`
            INSERT INTO gallery_images (content_id, src, title)
            VALUES (?, ?, ?)
        `);

        // Check if content table has existing photoalbum entries and delete them to prevent duplicates
        const existingPhotoAlbumsCount = db.prepare("SELECT COUNT(*) FROM content WHERE category = 'photoalbum'").get()['COUNT(*)'];
        if (existingPhotoAlbumsCount > 0) {
            console.warn(`Found ${existingPhotoAlbumsCount} existing 'photoalbum' entries. Deleting them before migration.`);
            db.prepare("DELETE FROM gallery_images WHERE content_id IN (SELECT id FROM content WHERE category = 'photoalbum')").run();
            db.prepare("DELETE FROM content WHERE category = 'photoalbum'").run();
        }

        const insertAll = db.transaction((albumsToInsert: PhotoAlbum[]) => {
            for (const album of albumsToInsert) {
                const slug = createSlug(album.albumTitle);
                const coverImageSrc = album.photos.length > 0 ? album.photos[0].src : null;
                const body = 'Фотоальбом'; // Generic description

                const contentResult = insertContentStmt.run(
                    slug,
                    album.albumTitle,
                    album.albumDate,
                    'photoalbum', // Hardcoded category
                    body,
                    coverImageSrc
                );
                const contentId = contentResult.lastInsertRowid;

                for (const photo of album.photos) {
                    insertGalleryImageStmt.run(contentId, photo.src, photo.title);
                }
                console.log(`Migrated album: ${album.albumTitle} (ID: ${contentId})`);
            }
        });

        insertAll(albums);

        console.log('Photo album migration completed successfully!');
    } catch (error) {
        console.error('Error during photo album migration:', error);
    } finally {
        db.close();
        console.log('Database connection closed.');
    }
}

migratePhotoAlbums();
