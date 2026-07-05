import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../src/data/database.db');

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

console.log('🚀 Initializing database...');

const createContentTable = `
CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    time TEXT,
    venue TEXT,
    tags TEXT,
    body TEXT NOT NULL,
    cover_image_src TEXT
);
`;

const createGalleryImagesTable = `
CREATE TABLE IF NOT EXISTS gallery_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id INTEGER NOT NULL,
    src TEXT NOT NULL,
    title TEXT,
    FOREIGN KEY (content_id) REFERENCES content (id) ON DELETE CASCADE
);
`;

db.exec(createContentTable);
console.log('✅ Table "content" created or already exists.');

db.exec(createGalleryImagesTable);
console.log('✅ Table "gallery_images" created or already exists.');

db.close();
console.log('🎉 Database setup complete. Database file is at src/data/database.db');
