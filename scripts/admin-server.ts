import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const STAGING_ROOT = path.join(__dirname, 'staging');
const MEDIA_TARGET_ROOT = path.resolve(__dirname, '..', 'public/media');
const LEGACY_MANIFEST_PATH = path.resolve(__dirname, '..', 'src/data/media-manifest.json');
const PUBLIC_MANIFEST_PATH = path.join(MEDIA_TARGET_ROOT, 'manifest.json');

function parseMarkdown(content: string): { frontmatter: Record<string, string>, body: string } | null {
    const cleanedContent = content.replace(/^\uFEFF/, '');
    const frontmatterMatch = cleanedContent.match(new RegExp(`^---([\s\S]*?)---([\s\S]*)$`));
    if (!frontmatterMatch) return null;
    const [, frontmatterStr, body] = frontmatterMatch;
    const frontmatter: Record<string, string> = {};
    frontmatterStr.split(/\r?\n/).forEach(line => {
        const match = line.match(/^([^:]+):\s*(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, '');
            frontmatter[key] = value;
        }
    });
    return { frontmatter, body: body.trim() };
}

function createSlug(text) {
  const a = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'};
  return text.toLowerCase().split('').map(char => a[char] || char).join('').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function generatePublicManifest() {
  console.log('🔄 Обновление публичного манифеста (Markdown)...');
  async function findMdFiles(dir) {
    let files = [];
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files = files.concat(await findMdFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') { console.error(`Ошибка при сканировании директории ${dir}:`, error); }
    }
    return files;
  }
  try {
    const allMdPaths = await findMdFiles(MEDIA_TARGET_ROOT);
    const relativePaths = allMdPaths.map(p => '/' + path.relative(path.join(__dirname, '..', 'public'), p).replace(/\\/g, '/'));
    await fs.writeFile(PUBLIC_MANIFEST_PATH, JSON.stringify(relativePaths, null, 2), 'utf-8');
    console.log('✅ Публичный манифест (Markdown) обновлен.');
  } catch (error) {
    console.error('Ошибка при генерации публичного манифеста:', error);
  }
}

const upload = multer({ storage: multer.diskStorage({
    destination: STAGING_ROOT,
    filename: (req, file, cb) => cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8')),
}) });

// --- API ENDPOINTS ---

app.get('/api/content', async (req, res) => {
    try {
        const manifest = JSON.parse(await fs.readFile(LEGACY_MANIFEST_PATH, 'utf-8'));
        manifest.sort((a, b) => new Date(b.albumDate).getTime() - new Date(a.albumDate).getTime());
        res.json(manifest);
    } catch (error) {
        res.status(500).json({ success: false, message: "Could not read content list." });
    }
});

app.get('/api/content/:albumId', async (req, res) => {
    const { albumId } = req.params;
    try {
        const manifest = JSON.parse(await fs.readFile(LEGACY_MANIFEST_PATH, 'utf-8'));
        const album = manifest.find(a => a.albumId === albumId);
        if (!album) return res.status(404).json({ success: false, message: 'Album not found' });
        
        const year = new Date(album.albumDate).getFullYear().toString();
        const slug = album.albumId.replace(`-${year}`, '');
        
        const folderName = `${album.albumDate}-${slug}`;
        const mdFileName = `${folderName}.md`;
        const albumFolderPath = path.join(MEDIA_TARGET_ROOT, year, folderName);
        const mdFilePath = path.join(albumFolderPath, mdFileName);

        const rawContent = await fs.readFile(mdFilePath, 'utf-8');
        const parsed = parseMarkdown(rawContent);
        if (!parsed) return res.status(500).json({ success: false, message: 'Failed to parse markdown file' });
        
        const fullContent = { 
            ...album, 
            body: parsed.body, 
            time: parsed.frontmatter.time || '', 
            venue: parsed.frontmatter.venue || '', 
            tags: (parsed.frontmatter.tags || '').replace(/[\[\]']/g, '') 
        };
        res.json(fullContent);
    } catch (error) {
        console.error(`Error fetching content for ${albumId}:`, error);
        res.status(500).json({ success: false, message: 'Failed to fetch content details' });
    }
});

app.post('/api/add-content', upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'galleryImages' }]), async (req, res) => {
  console.log('🚀 Получен запрос на добавление контента...');
  try {
    const { title, date, contentType, body, time, venue, tags } = req.body;
    const coverImage = req.files.coverImage ? req.files.coverImage[0] : null;
    const galleryImages = req.files.galleryImages || [];

    const albumSlug = createSlug(title);
    const year = new Date(date).getFullYear().toString();
    const albumId = `${albumSlug}-${year}`;
    const newAlbumPath = path.join(MEDIA_TARGET_ROOT, year, `${date}-${albumSlug}`);
    await fs.mkdir(newAlbumPath, { recursive: true });
    console.log(`  - Создана папка медиа: ${newAlbumPath}`);

    const allImages = [];
    if (coverImage) {
        allImages.push({ type: 'cover', originalname: coverImage.originalname, path: coverImage.path });
    }
    if(galleryImages) {
        galleryImages.forEach(img => {
            allImages.push({ type: 'gallery', originalname: img.originalname, path: img.path });
        });
    }

    const photoObjects = [];
    let imageCounter = 1;
    let coverImageId = null;

    for (const image of allImages) {
        const newImageFullPath = path.join(newAlbumPath, image.originalname);
        await fs.rename(image.path, newImageFullPath);
        const photoId = `${albumSlug.replace(/-/g, '_')}_${year}_${String(imageCounter).padStart(2, '0')}`;
        const relativeSrc = '/' + path.relative(path.join(__dirname, '..', 'public'), newImageFullPath).replace(/\\/g, '/');
        photoObjects.push({ id: photoId, src: relativeSrc, title });

        if (image.type === 'cover') {
            coverImageId = photoId;
        }
        imageCounter++;
    }

    if (!coverImageId && photoObjects.length > 0) {
      coverImageId = photoObjects[0].id;
    }

    const mdFileName = `${date}-${albumSlug}.md`;
    const mdFilePath = path.join(newAlbumPath, mdFileName);
    const galleryIds = photoObjects.filter((p) => p.id !== coverImageId).map((p) => `- ${p.id}`).join('\n');
    const galleryBlock = galleryIds ? `\n\n<!-- gallery -->\n${galleryIds}` : '';

    let mdContent = `---
title: "${title}"
date: ${date}
category: ["${contentType}"]`;
    if (contentType === 'afisha') {
      if (time) mdContent += `\ntime: "${time}"`;
      if (venue) mdContent += `\nvenue: "${venue}"`;
      if (tags) mdContent += `\ntags: [${tags.split(',').map(t => `'${t.trim()}'`).join(', ')}]`;
    }
    if (coverImageId) mdContent += `\ncoverImageId: ${coverImageId}`;
    mdContent += `\n---\n\n${body}${galleryBlock}\n`;
    await fs.writeFile(mdFilePath, mdContent, 'utf-8');
    console.log(`  - Создан Markdown-файл: ${mdFilePath}`);

    let legacyManifest = [];
    try {
        legacyManifest = JSON.parse(await fs.readFile(LEGACY_MANIFEST_PATH, 'utf-8'));
    } catch (_e) {
        console.warn('  - Не удалось прочитать устаревший манифест, будет создан новый.');
    }

    if (legacyManifest.some(album => album.albumId === albumId)) {
        console.warn(`  - Альбом с ID "${albumId}" уже существует. Пропускаем добавление.`);
    } else {
        const newAlbum = {
          albumId,
          albumTitle: title,
          albumDate: date,
          albumCategory: contentType, 
          photos: photoObjects,
        };
        legacyManifest.push(newAlbum);
        await fs.writeFile(LEGACY_MANIFEST_PATH, JSON.stringify(legacyManifest, null, 2), 'utf-8');
        console.log(`  - ✅ Альбом "${title}" добавлен в устаревший манифест.`);
    }

    await generatePublicManifest();

    res.status(200).json({ success: true, message: 'Контент успешно добавлен!', path: newAlbumPath });
  } catch (error) {
    console.error('❌ Критическая ошибка при добавлении контента:', error);
    res.status(500).json({ success: false, message: 'Ошибка на сервере.' });
  }
});

// THIS IS THE NEW ENDPOINT FOR UPDATING
app.post('/api/content/:albumId', upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'galleryImages' }]), async (req, res) => {
    const { albumId } = req.params;
    console.log(`🚀 Получен запрос на обновление контента: ${albumId}`);
    try {
        const { title, date, contentType, body, time, venue, tags } = req.body;
        
        let legacyManifest = JSON.parse(await fs.readFile(LEGACY_MANIFEST_PATH, 'utf-8'));
        const albumIndex = legacyManifest.findIndex(a => a.albumId === albumId);
        if (albumIndex === -1) return res.status(404).json({ success: false, message: 'Album not found in manifest' });

        const albumToUpdate = legacyManifest[albumIndex];
        
        // NOTE: For V1, we assume title and date do not change, so path remains the same.
        const year = new Date(albumToUpdate.albumDate).getFullYear().toString();
        const slug = albumToUpdate.albumId.replace(`-${year}`, '');
        const albumPath = path.join(MEDIA_TARGET_ROOT, year, `${albumToUpdate.albumDate}-${slug}`);
        const mdFileName = `${albumToUpdate.albumDate}-${slug}.md`;
        const mdFilePath = path.join(albumPath, mdFileName);
        
        // For now, we add new photos, we don't delete old ones to keep it simple.
        const newCover = req.files.coverImage ? req.files.coverImage[0] : null;
        const newGalleryImages = req.files.galleryImages || [];
        
        let photoObjects = [...albumToUpdate.photos];
        let imageCounter = photoObjects.length + 1;
        
        const allNewImages = [];
        if(newCover) allNewImages.push({ file: newCover });
        newGalleryImages.forEach(img => allNewImages.push({ file: img }));

        for(const image of allNewImages) {
            const newImageFullPath = path.join(albumPath, image.file.originalname);
            await fs.rename(image.file.path, newImageFullPath);
            const photoId = `${slug.replace(/-/g, '_')}_${year}_${String(imageCounter).padStart(2, '0')}`;
            const relativeSrc = '/' + path.relative(path.join(__dirname, '..', 'public'), newImageFullPath).replace(/\\/g, '/');
            photoObjects.push({ id: photoId, src: relativeSrc, title: title });
            imageCounter++;
        }

        // Re-generate gallery block for MD file
        const coverImageId = (photoObjects.find(p => p.id.includes('_01')) || photoObjects[0])?.id;
        const galleryIds = photoObjects.filter((p) => p.id !== coverImageId).map((p) => `- ${p.id}`).join('');
        const galleryBlock = galleryIds ? `

<!-- gallery -->
${galleryIds}` : '';

        let mdContent = `---
title: "${title}"
date: "${date}"
category: ["${contentType}"]`;
        if (contentType === 'afisha') {
            if (time) mdContent += `
time: "${time}"`;
            if (venue) mdContent += `
venue: "${venue}"`;
            if (tags) mdContent += `
tags: [${tags.split(',').map(t => `'${t.trim()}'`).join(', ')}]`;
        }
        if (coverImageId) mdContent += `
coverImageId: ${coverImageId}`;
        mdContent += `
---

${body}${galleryBlock}
`;
        await fs.writeFile(mdFilePath, mdContent, 'utf-8');

        // Update the manifest entry
        albumToUpdate.albumTitle = title;
        albumToUpdate.albumCategory = contentType;
        albumToUpdate.photos = photoObjects;
        legacyManifest[albumIndex] = albumToUpdate;

        await fs.writeFile(LEGACY_MANIFEST_PATH, JSON.stringify(legacyManifest, null, 2), 'utf-8');
        
        await generatePublicManifest();
        res.status(200).json({ success: true, message: 'Контент успешно обновлен!' });
    } catch (error) {
        console.error(`❌ Критическая ошибка при обновлении ${albumId}:`, error);
        res.status(500).json({ success: false, message: 'Ошибка на сервере при обновлении.' });
    }
});


// --- SERVER START ---
app.listen(PORT, async () => {
  await fs.mkdir(STAGING_ROOT, { recursive: true });
  console.log(`🚀 API-сервер запущен на порту ${PORT}`);
});
