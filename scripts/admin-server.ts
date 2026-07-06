import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Database Connection ---
const dbPath = path.resolve(__dirname, '../src/data/database.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
console.log('Database connection opened for admin server.');
// --- End Database Connection ---


const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '..')));

const STAGING_ROOT = path.join(__dirname, 'staging');
fs.mkdir(STAGING_ROOT, { recursive: true });

const MEDIA_TARGET_ROOT = path.resolve(__dirname, '..', 'public/media');

function createSlug(text: string): string {
  const a = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'};
  return text.toLowerCase().split('').map(char => a[char] || char).join('').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

const upload = multer({ storage: multer.diskStorage({
    destination: STAGING_ROOT,
    filename: (req, file, cb) => cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8')),
}) });

// --- PUBLIC API ENDPOINTS ---

const getPublicContent = (category: 'news' | 'afisha', res: express.Response) => {
    try {
        const contentStmt = db.prepare('SELECT * FROM content WHERE category = ? ORDER BY date DESC');
        const galleryStmt = db.prepare('SELECT src, title FROM gallery_images WHERE content_id = ?');
        
        const mainContent = contentStmt.all(category);

        const result = mainContent.map((item: any) => {
            const gallery = galleryStmt.all(item.id);
            const cover = gallery.find(p => p.src === item.cover_image_src) || gallery[0] || null;
            return {
                id: item.id.toString(),
                slug: item.slug,
                title: item.title,
                date: item.date,
                description: item.body.slice(0, 250).replace(/[#*_~`]/g, '').trim(),
                content: item.body,
                category: item.category,
                cover: cover,
                gallery: gallery,
            };
        });
        res.json(result);
    } catch (error) {
        console.error(`Error fetching public content for ${category}:`, error);
        res.status(500).json([]);
    }
}

app.get('/api/news', (req, res) => {
    getPublicContent('news', res);
});

app.get('/api/afisha', (req, res) => {
    getPublicContent('afisha', res);
});

app.get('/api/achievements', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM achievements ORDER BY date DESC');
        const achievements = stmt.all();
        // The frontend expects the 'image' property, but the DB has 'image_src'. Adapt it.
        const adaptedAchievements = achievements.map((item: any) => ({
            ...item,
            image: item.image_src
        }));
        res.json(adaptedAchievements);
    } catch (error) {
        console.error(`Error fetching achievements:`, error);
        res.status(500).json([]);
    }
});

app.get('/api/videos', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM videos ORDER BY date DESC');
        const videos = stmt.all();
        // The frontend expects `videoUrl`, but the DB has `video_url`.
        const adaptedVideos = videos.map((item: any) => ({
            ...item,
            videoUrl: item.video_url
        }));
        res.json(adaptedVideos);
    } catch (error) {
        console.error(`Error fetching videos:`, error);
        res.status(500).json([]);
    }
});

app.get('/api/library', (req, res) => {
    const category = req.query.category as string;
    try {
        let links;
        if (category && category !== 'Все') {
            const stmt = db.prepare('SELECT * FROM library_links WHERE category = ? ORDER BY title');
            links = stmt.all(category);
        } else {
            const stmt = db.prepare('SELECT * FROM library_links ORDER BY category, title');
            links = stmt.all();
        }

        const categoryStmt = db.prepare('SELECT DISTINCT category FROM library_links ORDER BY category');
        const categories = categoryStmt.all().map((cat: any) => cat.category);
        
        res.json({ links, categories });
    } catch (error) {
        console.error(`Error fetching library links:`, error);
        res.status(500).json({ links: [], categories: [] });
    }
});



// --- ADMIN API ENDPOINTS ---

// Generic list endpoint for admin tables
app.get('/api/admin/list/:manager', (req, res) => {
    const manager = req.params.manager;
    const tableMap: Record<string, string> = {
        content: 'content',
        achievements: 'achievements',
        videos: 'videos',
        library: 'library_links'
    };
    const tableName = tableMap[manager];

    if (!tableName) {
        return res.status(400).json({ success: false, message: 'Invalid manager type' });
    }

    try {
        let query;
        if (tableName === 'content') {
            query = `SELECT id, title, date, category FROM ${tableName} ORDER BY date DESC`;
        } else if (tableName === 'library_links') {
            query = `SELECT id, title, category FROM ${tableName} ORDER BY title ASC`;
        } else {
            query = `SELECT id, title, date FROM ${tableName} ORDER BY date DESC`;
        }
        const stmt = db.prepare(query);
        const items = stmt.all();
        res.json(items);
    } catch (error) {
        console.error(`Error fetching list for ${manager}:`, error);
        res.status(500).json([]);
    }
});


// Achievements CRUD
app.get('/api/achievements/:id', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM achievements WHERE id = ?');
        const achievement = stmt.get(req.params.id);
        if (achievement) {
            res.json(achievement);
        } else {
            res.status(404).json({ success: false, message: 'Achievement not found' });
        }
    } catch (error) {
        console.error(`Error fetching achievement ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/achievements', (req, res) => {
    try {
        const { title, student_name, competition, date, place, category, image_src } = req.body;
        const stmt = db.prepare(`
            INSERT INTO achievements (title, student_name, competition, date, place, category, image_src)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(title, student_name, competition, date, place, category, image_src);
        res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        console.error('Error creating achievement:', error);
        res.status(500).json({ success: false, message: 'Failed to create achievement' });
    }
});

app.post('/api/achievements/:id', (req, res) => {
    try {
        const { title, student_name, competition, date, place, category, image_src } = req.body;
        const stmt = db.prepare(`
            UPDATE achievements 
            SET title = ?, student_name = ?, competition = ?, date = ?, place = ?, category = ?, image_src = ?
            WHERE id = ?
        `);
        const result = stmt.run(title, student_name, competition, date, place, category, image_src, req.params.id);
        if (result.changes > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Achievement not found' });
        }
    } catch (error) {
        console.error(`Error updating achievement ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Failed to update achievement' });
    }
});

app.delete('/api/achievements/:id', (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM achievements WHERE id = ?');
        const result = stmt.run(req.params.id);
        if (result.changes > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Achievement not found' });
        }
    } catch (error) {
        console.error(`Error deleting achievement ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Failed to delete achievement' });
    }
});

// Videos CRUD
app.get('/api/videos/:id', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM videos WHERE id = ?');
        const video = stmt.get(req.params.id);
        if (video) {
            res.json(video);
        } else {
            res.status(404).json({ success: false, message: 'Video not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/videos', (req, res) => {
    try {
        const { title, description, video_url, date, source } = req.body;
        const stmt = db.prepare(`
            INSERT INTO videos (title, description, video_url, date, source)
            VALUES (?, ?, ?, ?, ?)
        `);
        const result = stmt.run(title, description, video_url, date, source);
        res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        console.error('Error creating video:', error);
        res.status(500).json({ success: false, message: 'Failed to create video' });
    }
});

app.post('/api/videos/:id', (req, res) => {
    try {
        const { title, description, video_url, date, source } = req.body;
        const stmt = db.prepare(`
            UPDATE videos 
            SET title = ?, description = ?, video_url = ?, date = ?, source = ?
            WHERE id = ?
        `);
        const result = stmt.run(title, description, video_url, date, source, req.params.id);
        if (result.changes > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Video not found' });
        }
    } catch (error) {
        console.error(`Error updating video ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Failed to update video' });
    }
});

app.delete('/api/videos/:id', (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM videos WHERE id = ?');
        const result = stmt.run(req.params.id);
        if (result.changes > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Video not found' });
        }
    } catch (error) {
        console.error(`Error deleting video ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Failed to delete video' });
    }
});

// Library Links CRUD
app.get('/api/library/:id', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM library_links WHERE id = ?');
        const link = stmt.get(req.params.id);
        if (link) {
            res.json(link);
        } else {
            res.status(404).json({ success: false, message: 'Link not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/library', (req, res) => {
    try {
        const { title, description, url, category } = req.body;
        const stmt = db.prepare(`
            INSERT INTO library_links (title, description, url, category)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(title, description, url, category);
        res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        console.error('Error creating library link:', error);
        res.status(500).json({ success: false, message: 'Failed to create library link' });
    }
});

app.post('/api/library/:id', (req, res) => {
    try {
        const { title, description, url, category } = req.body;
        const stmt = db.prepare(`
            UPDATE library_links 
            SET title = ?, description = ?, url = ?, category = ?
            WHERE id = ?
        `);
        const result = stmt.run(title, description, url, category, req.params.id);
        if (result.changes > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Link not found' });
        }
    } catch (error) {
        console.error(`Error updating library link ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Failed to update library link' });
    }
});

app.delete('/api/library/:id', (req, res) => {
    try {
        const stmt = db.prepare('DELETE FROM library_links WHERE id = ?');
        const result = stmt.run(req.params.id);
        if (result.changes > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Link not found' });
        }
    } catch (error) {
        console.error(`Error deleting library link ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Failed to delete library link' });
    }
});




// GET /api/content - List all content
app.get('/api/content', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT id, slug, title, date, category, cover_image_src
            FROM content
            ORDER BY date DESC
        `);
        const content = stmt.all();
        // The frontend expects albumId, albumTitle, albumDate, etc. Let's adapt.
        const adaptedContent = content.map(item => ({
            albumId: item.id, // Use the REAL id
            albumTitle: item.title,
            albumDate: item.date,
            albumCategory: item.category,
            photos: [{ src: item.cover_image_src }] // Provide a minimal photo object for display
        }));
        res.json(adaptedContent);
    } catch (error) {
        console.error('Error fetching content list:', error);
        res.status(500).json({ success: false, message: "Could not read content list from database." });
    }
});

// GET /api/content/:id - Get a single content item for editing
app.get('/api/content/:id', (req, res) => {
    try {
        const contentStmt = db.prepare('SELECT * FROM content WHERE id = ?');
        const content = contentStmt.get(req.params.id);

        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }

        const galleryStmt = db.prepare('SELECT * FROM gallery_images WHERE content_id = ?');
        const gallery = galleryStmt.all(req.params.id);

        content.photos = gallery; // Attach gallery to the main content object
        // Adapt for frontend
        content.albumId = content.id;
        content.albumTitle = content.title;
        content.albumDate = content.date;


        res.json(content);
    } catch (error) {
        console.error(`Error fetching content for id ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: 'Failed to fetch content details from database' });
    }
});

// POST /api/content - Create new content
app.post('/api/content', upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'galleryImages' }]), async (req, res) => {
    console.log('🚀 Received request to add content to DB...');
    try {
        const { title, date, category, subcategory, body, time, venue, tags } = req.body;
        const slug = createSlug(title);
        const coverImageFile = req.files.coverImage ? req.files.coverImage[0] : null;
        const galleryImageFiles = req.files.galleryImages || [];

        // For simplicity, we still save images to a path based on date and slug.
        const year = new Date(date).getFullYear().toString();
        const imageDir = path.join(year, `${date}-${slug}`);
        const imageDirPath = path.join(MEDIA_TARGET_ROOT, imageDir);
        await fs.mkdir(imageDirPath, { recursive: true });

        let coverImageSrc = null;
        if (coverImageFile) {
            const newPath = path.join(imageDirPath, coverImageFile.originalname);
            await fs.rename(coverImageFile.path, newPath);
            coverImageSrc = path.join('/media', imageDir, coverImageFile.originalname).replace(/\\/g, '/');
        }

        const insertContentStmt = db.prepare(`
            INSERT INTO content (slug, title, date, category, time, venue, tags, body, cover_image_src)
            VALUES (@slug, @title, @date, @category, @time, @venue, @tags, @body, @cover_image_src)
        `);

        const result = insertContentStmt.run({
            slug, title, date, category, body,
            time: time || null,
            venue: venue || null,
            tags: tags ? JSON.stringify(tags.split(',')) : JSON.stringify([]),
            cover_image_src: coverImageSrc
        });

        const newContentId = result.lastInsertRowid;
        const insertGalleryImageStmt = db.prepare(`
            INSERT INTO gallery_images (content_id, src, title) VALUES (?, ?, ?)
        `);

        if(coverImageSrc) {
            insertGalleryImageStmt.run(newContentId, coverImageSrc, title);
        }

        for (const imageFile of galleryImageFiles) {
            const newPath = path.join(imageDirPath, imageFile.originalname);
            await fs.rename(imageFile.path, newPath);
            const imageSrc = path.join('/media', imageDir, imageFile.originalname).replace(/\\/g, '/');
            insertGalleryImageStmt.run(newContentId, imageSrc, title);
        }

        res.status(201).json({ success: true, message: 'Content successfully created in database.', id: newContentId });

    } catch (error) {
        console.error('❌ Error creating content in database:', error);
        res.status(500).json({ success: false, message: 'Failed to create content in database.' });
    }
});

// POST /api/content/:id - Update existing content
app.post('/api/content/:id', upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'galleryImages' }]), async (req, res) => {
    const { id } = req.params;
    console.log(`🚀 Received request to update content id: ${id}`);
    try {
        const { title, date, category, subcategory, body, time, venue, tags } = req.body;
        const slug = createSlug(title); // Create a new slug from the potentially new title

        const updateStmt = db.prepare(`
            UPDATE content
            SET title = ?, slug = ?, date = ?, category = ?, body = ?, time = ?, venue = ?, tags = ?
            WHERE id = ?
        `);
        
        updateStmt.run(title, slug, date, category, body, time, venue, tags ? JSON.stringify(tags.split(',')) : JSON.stringify([]), id);
        
        // Image handling can be added here (deleting old ones, adding new ones)
        // For now, we focus on making text content editable.

        res.status(200).json({ success: true, message: 'Content successfully updated.' });
    } catch (error) {
        console.error(`❌ Error updating content for id ${id}:`, error);
        res.status(500).json({ success: false, message: 'Failed to update content.' });
    }
});

// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`🚀 Database-driven API server running on port ${PORT}`);
});
