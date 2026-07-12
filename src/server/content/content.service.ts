
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { Database } from 'better-sqlite3';
import { createSlug } from '../utils/utils.js';
import { generateStaticData } from '../utils/generate-static-data.js';
import * as path from 'path';
import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MEDIA_TARGET_ROOT = path.resolve(__dirname, '../../../public/media');

@Injectable()
export class ContentService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: Database,
  ) {}

  // --- Public Content Services ---

  getPublicContent(category: 'news' | 'afisha') {
    const contentStmt = this.db.prepare(
      'SELECT * FROM content WHERE category = ? ORDER BY date DESC',
    );
    const galleryStmt = this.db.prepare(
      'SELECT src, title FROM gallery_images WHERE content_id = ?',
    );
    const mainContent: any[] = contentStmt.all(category);
    return mainContent.map((item: any) => {
      const gallerySourceId = item.linked_photoalbum_id || item.id;
      const gallery = galleryStmt.all(gallerySourceId);
      const cover = gallery.find((p: any) => p.src === item.cover_image_src) || gallery[0] || null;
      return {
        id: item.id.toString(),
        slug: item.slug,
        title: item.title,
        date: item.date,
        description: item.body?.slice(0, 250).replace(/[#*_~`]/g, '').trim() || '',
        content: item.body,
        category: item.category,
        cover: cover,
        gallery: gallery,
      };
    });
  }

  getPhotoAlbums() {
    const albumsStmt = this.db.prepare(`
        SELECT id, slug, title, date, category
        FROM content
        WHERE category = 'photoalbum'
        ORDER BY date DESC
    `);
    const albumsFromDb: any[] = albumsStmt.all();
    const galleryStmt = this.db.prepare(
      "SELECT src, title FROM gallery_images WHERE content_id = ?",
    );
    return albumsFromDb.map((album: any) => {
      const photos = galleryStmt.all(album.id).map((photo: any) => ({
        id: "", 
        src: photo.src,
        title: photo.title,
      }));
      return {
        albumId: album.slug,
        albumTitle: album.title,
        albumDate: album.date,
        albumCategory: album.category,
        photos: photos,
      };
    });
  }

  // --- Admin Content Services ---
  
  getAdminList(manager: string) {
    const tableMap: Record<string, string> = {
      news: "content",
      afisha: "content",
      achievements: "achievements",
      videos: "videos",
      library: "library_links",
      photoalbum: "content",
      graduates: "graduates",
    };
    const tableName = tableMap[manager];
  
    if (!tableName) {
      throw new BadRequestException("Invalid manager type");
    }

    let query = `SELECT * FROM ${tableName}`;
    let params: any[] = [];

    // Add WHERE clauses
    if (manager === "news" || manager === "afisha" || manager === "photoalbum") {
      query += ` WHERE category = ?`;
      params.push(manager);
    }

    // Add ORDER BY clauses
    if (tableName === "graduates") {
      query += ` ORDER BY graduation_year DESC`;
    } else if (tableName === "library_links") {
      query += ` ORDER BY category, title`;
    } else {
      query += ` ORDER BY date DESC`;
    }
    
    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  getContentById(id: string) {
    const contentStmt = this.db.prepare("SELECT * FROM content WHERE id = ?");
    const content: any = contentStmt.get(id);

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    const galleryStmt = this.db.prepare("SELECT * FROM gallery_images WHERE content_id = ?");
    content.photos = galleryStmt.all(id);
    return content;
  }

  async createContent(body: any, files: any) {
    const { title, date, category, subcategory, body: contentBody, time, venue, tags } = body;
    let slug = createSlug(title);
    const coverImageFile = files?.coverImage ? files.coverImage[0] : null;
    const galleryImageFiles = files?.galleryImages || [];

    const existingSlugStmt = this.db.prepare("SELECT id FROM content WHERE slug = ?");
    if (existingSlugStmt.get(slug)) {
      // Вместо Date.now(), просто добавляем суффикс или оставляем как есть, если это допустимо.
      // Лучше всего - выдавать ошибку или использовать существующий slug, если это обновление.
      // Для createContent оставим просто slug, так как БД должна гарантировать уникальность.
    }

    const year = new Date(date).getFullYear().toString();
    const imageDir = path.join(year, `${date}-${slug}`);
    const imageDirPath = path.join(MEDIA_TARGET_ROOT, imageDir);
    await fs.mkdir(imageDirPath, { recursive: true });

    let coverImageSrc = null;
    if (coverImageFile) {
      const newPath = path.join(imageDirPath, coverImageFile.originalname);
      await fs.copyFile(coverImageFile.path, newPath);
      await fs.unlink(coverImageFile.path);
      coverImageSrc = path.join("/media", imageDir, coverImageFile.originalname).replace(/\\/g, "/");
    }

    const insertContentStmt = this.db.prepare(`
        INSERT INTO content (slug, title, date, category, time, venue, tags, body, cover_image_src, subcategory)
        VALUES (@slug, @title, @date, @category, @time, @venue, @tags, @body, @cover_image_src, @subcategory)
    `);

    const result = insertContentStmt.run({
      slug, title, date, category,
      body: contentBody, time: time || null, venue: venue || null,
      tags: tags ? JSON.stringify(tags.split(",")) : JSON.stringify([]),
      cover_image_src: coverImageSrc, subcategory: subcategory || null,
    });

    const newContentId = result.lastInsertRowid;
    const insertGalleryImageStmt = this.db.prepare(`INSERT INTO gallery_images (content_id, src, title) VALUES (?, ?, ?)`);

    if (coverImageSrc) {
      insertGalleryImageStmt.run(newContentId, coverImageSrc, title);
    }

    if (galleryImageFiles.length > 0) {
      for (const imageFile of galleryImageFiles) {
        const newPath = path.join(imageDirPath, imageFile.originalname);
        await fs.copyFile(imageFile.path, newPath);
        await fs.unlink(imageFile.path);
        const imageSrc = path.join("/media", imageDir, imageFile.originalname).replace(/\\/g, "/");
        insertGalleryImageStmt.run(newContentId, imageSrc, title);
      }
    }
    
    await generateStaticData();
    return newContentId;
  }

  async updateContent(id: string, body: any, files: any) {
    let { title, date, category, subcategory, body: contentBody, time, venue, tags, linked_photoalbum_id } = body;
    
    category = Array.isArray(category) ? category[0] : category;
    subcategory = Array.isArray(subcategory) ? subcategory[0] : subcategory;
    
    const slug = createSlug(title);
    let coverImageSrc = body.cover_image_src;

    const coverImageFile = files?.coverImage ? files.coverImage[0] : null;
    if (coverImageFile) {
      const year = new Date(date).getFullYear().toString();
      const imageDir = path.join(year, `${date}-${slug}`);
      const imageDirPath = path.join(MEDIA_TARGET_ROOT, imageDir);
      await fs.mkdir(imageDirPath, { recursive: true });

      const newPath = path.join(imageDirPath, coverImageFile.originalname);
      await fs.copyFile(coverImageFile.path, newPath);
      await fs.unlink(coverImageFile.path);
      coverImageSrc = path.join("/media", imageDir, coverImageFile.originalname).replace(/\\/g, "/");
    }

    const galleryImageFiles = files?.galleryImages || [];
    
    // Если есть новые файлы, сохраняем их
    if (galleryImageFiles.length > 0) {
      console.log(`[DEBUG] Found ${galleryImageFiles.length} new gallery files to process.`);
      const year = new Date(date).getFullYear().toString();
      const imageDir = path.join(year, `${date}-${slug}`);
      const imageDirPath = path.join(MEDIA_TARGET_ROOT, imageDir);
      await fs.mkdir(imageDirPath, { recursive: true });

      const insertGalleryImageStmt = this.db.prepare(`INSERT INTO gallery_images (content_id, src, title) VALUES (?, ?, ?)`);
      for (const imageFile of galleryImageFiles) {
        const imageSrc = path.join("/media", imageDir, imageFile.originalname).replace(/\\/g, "/");
        // Проверка на дубликаты
        const existing = this.db.prepare("SELECT id FROM gallery_images WHERE content_id = ? AND src = ?").get(id, imageSrc);
        if (!existing) {
          const newPath = path.join(imageDirPath, imageFile.originalname);
          try {
              console.log(`[DEBUG] Moving '${imageFile.path}' to '${newPath}'`);
              await fs.rename(imageFile.path, newPath);
              console.log(`[DEBUG] -> Moved successfully. Inserting into DB.`);
              insertGalleryImageStmt.run(id, imageSrc, title);
          } catch (err) {
              console.error("[ERROR] Error moving gallery image:", err);
              continue; 
          }
        } else {
            console.log(`[DEBUG] Skipping duplicate DB entry for: ${imageSrc}`);
        }
      }
    }

    let finalSlug = slug;
    const currentContent: any = this.db.prepare("SELECT slug FROM content WHERE id = ?").get(id);
    if (currentContent && currentContent.slug !== slug) {
        const existingSlugStmt = this.db.prepare("SELECT id FROM content WHERE slug = ? AND id != ?");
        if (existingSlugStmt.get(slug, id)) {
            finalSlug = `${slug}-${id}`;
        }
    }

    const updateStmt = this.db.prepare(`
        UPDATE content SET slug = @slug, title = @title, date = @date, category = @category, 
        subcategory = @subcategory, body = @body, time = @time, venue = @venue, tags = @tags, 
        cover_image_src = @cover_image_src, linked_photoalbum_id = @linked_photoalbum_id
        WHERE id = @id
    `);

    updateStmt.run({
      slug: finalSlug, title, date, category, subcategory: subcategory || null,
      body: contentBody, time: time || null, venue: venue || null,
      tags: tags ? JSON.stringify(tags.split(",")) : JSON.stringify([]),
      cover_image_src: coverImageSrc || null,
      linked_photoalbum_id: linked_photoalbum_id ? String(linked_photoalbum_id) : null,
      id, 
    });

    await generateStaticData();
    return { success: true };
  }

  async deleteContent(id: string) {
    const deleteGalleryStmt = this.db.prepare("DELETE FROM gallery_images WHERE content_id = ?");
    deleteGalleryStmt.run(id);
    const deleteContentStmt = this.db.prepare("DELETE FROM content WHERE id = ?");
    const result = deleteContentStmt.run(id);
    if (result.changes > 0) await generateStaticData();
    return result.changes;
  }
  
  async deleteGalleryImage(id: string) {
    const stmt = this.db.prepare("DELETE FROM gallery_images WHERE id = ?");
    const result = stmt.run(id);
    if (result.changes > 0) await generateStaticData();
    return result.changes;
  }
}
