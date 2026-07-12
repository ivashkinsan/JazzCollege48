import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const dbPath = path.resolve(process.cwd(), 'src/data/database.db');
const STATIC_DATA_DIR = path.resolve(process.cwd(), 'public/data');
// --- End Configuration ---

console.log('🚀 Generating static data...');

export async function generateStaticData() {
    let db: Database.Database | null = null;
    try {
        db = new Database(dbPath);
        db.pragma('journal_mode = WAL');

        await fs.mkdir(STATIC_DATA_DIR, { recursive: true });

        // --- Helper functions to extract data ---
        const getGalleryImages = (contentId: number) => {
            const galleryStmt = db!.prepare('SELECT src, title FROM gallery_images WHERE content_id = ?');
            return galleryStmt.all(contentId);
        };

        const getPhotoalbumPhotos = (albumId: number) => {
            const galleryStmt = db!.prepare('SELECT src, title FROM gallery_images WHERE content_id = ?');
            return galleryStmt.all(albumId).map((photo: any) => ({
                id: '', // Frontend expects ID, but not in DB for now
                src: photo.src,
                title: photo.title
            }));
        };

        // --- Generate News Data ---
        const newsContentStmt = db.prepare("SELECT * FROM content WHERE category = 'news' ORDER BY date DESC");
        const rawNews = newsContentStmt.all();
        const newsData = rawNews.map((item: any) => {
            const gallerySourceId = item.linked_photoalbum_id || item.id;
            return {
                id: item.id.toString(),
                slug: item.slug,
                title: item.title,
                date: item.date,
                description: item.body?.slice(0, 250).replace(/[#*_~`]/g, '').trim() || '',
                content: item.body,
                category: item.category,
                cover: item.cover_image_src ? { src: item.cover_image_src, title: item.title } : undefined,
                gallery: getGalleryImages(gallerySourceId),
                linked_photoalbum_id: item.linked_photoalbum_id
            };
        });
        await fs.writeFile(path.join(STATIC_DATA_DIR, 'news.json'), JSON.stringify(newsData, null, 2));

        // --- Generate Afisha Data ---
        const afishaContentStmt = db.prepare("SELECT * FROM content WHERE category = 'afisha' ORDER BY date DESC");
        const rawAfisha = afishaContentStmt.all();
        const afishaData = rawAfisha.map((item: any) => ({
            id: item.id.toString(),
            slug: item.slug,
            title: item.title,
            date: item.date,
            time: item.time,
            venue: item.venue,
            content: item.body,
            category: item.category,
            cover: item.cover_image_src ? { src: item.cover_image_src, title: item.title } : undefined,
            gallery: getGalleryImages(item.id),
            linked_photoalbum_id: item.linked_photoalbum_id
        }));
        await fs.writeFile(path.join(STATIC_DATA_DIR, 'afisha.json'), JSON.stringify(afishaData, null, 2));

        // --- Generate Achievements Data ---
        const achievementsStmt = db.prepare('SELECT * FROM achievements ORDER BY date DESC');
        const achievementsData = achievementsStmt.all().map((item: any) => ({
            ...item,
            image: item.image_src // Adapt to frontend expectation
        }));
        await fs.writeFile(path.join(STATIC_DATA_DIR, 'achievements.json'), JSON.stringify(achievementsData, null, 2));

        // --- Generate Videos Data ---
        const videosStmt = db.prepare('SELECT * FROM videos ORDER BY date DESC');
        const videosData = videosStmt.all().map((item: any) => ({
            ...item,
            videoUrl: item.video_url // Adapt to frontend expectation
        }));
        await fs.writeFile(path.join(STATIC_DATA_DIR, 'videos.json'), JSON.stringify(videosData, null, 2));

        // --- Generate Library Data ---
        const libraryLinksStmt = db.prepare('SELECT * FROM library_links ORDER BY category, title');
        const libraryLinks = libraryLinksStmt.all();
        const categoryStmt = db.prepare('SELECT DISTINCT category FROM library_links ORDER BY category');
        const categories = categoryStmt.all().map((cat: any) => cat.category);
        const libraryData = { links: libraryLinks, categories: categories };
        await fs.writeFile(path.join(STATIC_DATA_DIR, 'library.json'), JSON.stringify(libraryData, null, 2));

        // --- Generate Photo Albums Data ---
        const albumsStmt = db.prepare(`
            SELECT id, slug, title, date, category, subcategory
            FROM content
            WHERE category = 'photoalbum'
            ORDER BY date DESC
        `);
        const albumsFromDb = albumsStmt.all();
        const photoalbumsData = albumsFromDb.map((album: any) => {
            const photos = getPhotoalbumPhotos(album.id);
            return {
                albumId: album.slug,
                albumTitle: album.title,
                albumDate: album.date,
                albumCategory: album.subcategory || album.category, // Use subcategory, fallback to category
                photos: photos,
            };
        });
        await fs.writeFile(path.join(STATIC_DATA_DIR, 'photoalbums.json'), JSON.stringify(photoalbumsData, null, 2));

        // --- Generate Graduates Data ---
        const graduatesStmt = db.prepare('SELECT * FROM graduates ORDER BY graduation_year DESC, name ASC');
        const graduatesData = graduatesStmt.all().map((item: any) => ({
            ...item,
            graduationYear: item.graduation_year, // Fix property name
            image: item.image_src, // Adapt to frontend expectation
            isFeatured: Boolean(item.is_featured)
        }));
        await fs.writeFile(path.join(STATIC_DATA_DIR, 'graduates.json'), JSON.stringify(graduatesData, null, 2));

        console.log('🎉 Static data generation complete.');

    } catch (error) {
        console.error('❌ Error generating static data:', error);
        process.exit(1); // Exit with error code
    } finally {
        if (db) {
            db.close();
        }
    }
}
