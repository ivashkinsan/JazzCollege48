import express from 'express';
import db from './db.ts';
import { upload, createSlug } from './utils.ts';
import { generateStaticData } from '../generate-static-data.ts';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const MEDIA_TARGET_ROOT = path.resolve(__dirname, "../../public/media");

const getPublicContent = (
    category: "news" | "afisha",
    res: express.Response,
  ) => {
    try {
      const contentStmt = db.prepare(
        "SELECT * FROM content WHERE category = ? ORDER BY date DESC",
      );
      const galleryStmt = db.prepare(
        "SELECT src, title FROM gallery_images WHERE content_id = ?",
      );
  
      const mainContent = contentStmt.all(category);
  
      const result = mainContent.map((item: any) => {
        const gallerySourceId = item.linked_photoalbum_id || item.id;
        const gallery = galleryStmt.all(gallerySourceId);
  
        const cover =
          gallery.find((p) => p.src === item.cover_image_src) ||
          gallery[0] ||
          null;
        return {
          id: item.id.toString(),
          slug: item.slug,
          title: item.title,
          date: item.date,
          description: item.body
            .slice(0, 250)
            .replace(/[#*_~`]/g, "")
            .trim(),
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
  };

router.get("/news", (req, res) => {
    getPublicContent("news", res);
});
  
router.get("/afisha", (req, res) => {
    getPublicContent("afisha", res);
});

router.get("/photoalbums", (req, res) => {
    try {
      const albumsStmt = db.prepare(`
              SELECT id, slug, title, date, category
              FROM content
              WHERE category = 'photoalbum'
              ORDER BY date DESC
          `);
      const albumsFromDb = albumsStmt.all();
  
      const galleryStmt = db.prepare(
        "SELECT src, title FROM gallery_images WHERE content_id = ?",
      );
  
      const formattedAlbums = albumsFromDb.map((album: any) => {
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
      res.json(formattedAlbums);
    } catch (error) {
      console.error("Error fetching photo albums:", error);
      res.status(500).json([]);
    }
});

router.get("/content", (req, res) => {
    try {
      const stmt = db.prepare(`
              SELECT id, slug, title, date, category, cover_image_src
              FROM content
              ORDER BY date DESC
          `);
      const content = stmt.all();
      const adaptedContent = content.map((item) => ({
        albumId: item.id,
        albumTitle: item.title,
        albumDate: item.date,
        albumCategory: item.category,
        photos: [{ src: item.cover_image_src }],
      }));
      res.json(adaptedContent);
    } catch (error) {
      console.error("Error fetching content list:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Could not read content list from database.",
        });
    }
});
  
router.get("/content/:id", (req, res) => {
    try {
      const contentStmt = db.prepare("SELECT * FROM content WHERE id = ?");
      const content = contentStmt.get(req.params.id);
  
      if (!content) {
        return res
          .status(404)
          .json({ success: false, message: "Content not found" });
      }
  
      const galleryStmt = db.prepare(
        "SELECT * FROM gallery_images WHERE content_id = ?",
      );
      const gallery = galleryStmt.all(req.params.id);
  
      (content as any).photos = gallery;
      (content as any).albumId = content.id;
      (content as any).albumTitle = content.title;
      (content as any).albumDate = content.date;
  
      res.json(content);
    } catch (error) {
      console.error(`Error fetching content for id ${req.params.id}:`, error);
      res
        .status(500)
        .json({
          success: false,
          message: "Failed to fetch content details from database",
        });
    }
});
  
router.post("/content", upload.fields([ { name: "coverImage", maxCount: 1 }, { name: "galleryImages" }, ]), async (req, res) => {
      console.log("🚀 Received request to add content to DB...");
      try {
        const { title, date, category, subcategory, body, time, venue, tags } =
          req.body;
        let slug = createSlug(title);
        const coverImageFile = (req.files as any).coverImage
          ? (req.files as any).coverImage[0]
          : null;
        const galleryImageFiles = (req.files as any).galleryImages || [];
  
        const existingSlugStmt = db.prepare("SELECT id FROM content WHERE slug = ?");
        let existingSlug = existingSlugStmt.get(slug);
        if (existingSlug) {
          slug = `${slug}-${Date.now()}`;
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
          coverImageSrc = path
            .join("/media", imageDir, coverImageFile.originalname)
            .replace(/\\/g, "/");
        }
  
        const insertContentStmt = db.prepare(`
              INSERT INTO content (slug, title, date, category, time, venue, tags, body, cover_image_src, subcategory)
              VALUES (@slug, @title, @date, @category, @time, @venue, @tags, @body, @cover_image_src, @subcategory)
          `);
  
        const result = insertContentStmt.run({
          slug,
          title,
          date,
          category,
          body,
          time: time || null,
          venue: venue || null,
          tags: tags ? JSON.stringify(tags.split(",")) : JSON.stringify([]),
          cover_image_src: coverImageSrc,
          subcategory: subcategory || null,
        });
  
        const newContentId = result.lastInsertRowid;
        const insertGalleryImageStmt = db.prepare(`
              INSERT INTO gallery_images (content_id, src, title) VALUES (?, ?, ?)
          `);
  
        if (coverImageSrc) {
          insertGalleryImageStmt.run(newContentId, coverImageSrc, title);
        }
  
        for (const imageFile of galleryImageFiles) {
          const newPath = path.join(imageDirPath, imageFile.originalname);
          await fs.copyFile(imageFile.path, newPath);
          await fs.unlink(imageFile.path);
          const imageSrc = path
            .join("/media", imageDir, imageFile.originalname)
            .replace(/\\/g, "/");
          insertGalleryImageStmt.run(newContentId, imageSrc, title);
        }
        
        await generateStaticData();
        res
          .status(201)
          .json({
            success: true,
            message: "Content successfully created in database.",
            id: newContentId,
          });
      } catch (error) {
        console.error("❌ Error creating content in database:", error);
        res
          .status(500)
          .json({
            success: false,
            message: "Failed to create content in database.",
          });
      }
    },
);

router.post("/content/:id", upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "galleryImages" }, ]), async (req, res) => {
      const { id } = req.params;
      try {
        let {
          title, date, category, subcategory, body, time, venue, tags, linked_photoalbum_id,
        } = req.body;
        
        category = Array.isArray(category) ? category[0] : category;
        subcategory = Array.isArray(subcategory) ? subcategory[0] : subcategory;
        
        const slug = createSlug(title);
        let coverImageSrc = req.body.cover_image_src;
  
        const coverImageFile = (req.files as any).coverImage ? (req.files as any).coverImage[0] : null;
        if (coverImageFile) {
          const year = new Date(date).getFullYear().toString();
          const imageDir = path.join(year, `${date}-${slug}`);
          const imageDirPath = path.join(MEDIA_TARGET_ROOT, imageDir);
          await fs.mkdir(imageDirPath, { recursive: true });
  
          const newPath = path.join(imageDirPath, coverImageFile.originalname);
          await fs.copyFile(coverImageFile.path, newPath);
          await fs.unlink(coverImageFile.path);
          coverImageSrc = path
            .join("/media", imageDir, coverImageFile.originalname)
            .replace(/\\/g, "/");
        }
  
        const galleryImageFiles = (req.files as any).galleryImages || [];
        if (category === "photoalbum" && galleryImageFiles.length > 0) {
          const year = new Date(date).getFullYear().toString();
          const imageDir = path.join(year, `${date}-${slug}`);
          const imageDirPath = path.join(MEDIA_TARGET_ROOT, imageDir);
          await fs.mkdir(imageDirPath, { recursive: true });
  
          const insertGalleryImageStmt = db.prepare(`
                  INSERT INTO gallery_images (content_id, src, title) VALUES (?, ?, ?)
              `);
          for (const imageFile of galleryImageFiles) {
            const newPath = path.join(imageDirPath, imageFile.originalname);
            await fs.copyFile(imageFile.path, newPath);
            await fs.unlink(imageFile.path);
            const imageSrc = path
              .join("/media", imageDir, imageFile.originalname)
              .replace(/\\/g, "/");
            insertGalleryImageStmt.run(id, imageSrc, title);
          }
        }
  
        let finalSlug = slug;
        const currentContent: any = db.prepare("SELECT slug FROM content WHERE id = ?").get(id);
        
        if (currentContent && currentContent.slug !== slug) {
            const existingSlugStmt = db.prepare("SELECT id FROM content WHERE slug = ? AND id != ?");
            const existingSlug = existingSlugStmt.get(slug, id);
            if (existingSlug) {
                finalSlug = `${slug}-${id}`;
            }
        }
  
        const updateStmt = db.prepare(`
              UPDATE content
              SET slug = @slug, title = @title, date = @date, category = @category, subcategory = @subcategory, body = @body, time = @time, venue = @venue, tags = @tags, cover_image_src = @cover_image_src, linked_photoalbum_id = @linked_photoalbum_id
              WHERE id = @id
          `);
  
        updateStmt.run({
          slug: finalSlug,
          title,
          date,
          category: Array.isArray(category) ? category[0] : category,
          subcategory: subcategory || null,
          body,
          time: time || null,
          venue: venue || null,
          tags: tags ? JSON.stringify(tags.split(",")) : JSON.stringify([]),
          cover_image_src: coverImageSrc || null,
          linked_photoalbum_id: linked_photoalbum_id ? String(linked_photoalbum_id) : null,
          id, 
        });
  
        await generateStaticData();
        res
          .status(200)
          .json({ success: true, message: "Content successfully updated." });
      } catch (error) {
        console.error(`❌ Error updating content for id ${id}:`, error);
        res
          .status(500)
          .json({ success: false, message: "Failed to update content." });
      }
    },
);

router.delete("/content/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleteGalleryStmt = db.prepare(
        "DELETE FROM gallery_images WHERE content_id = ?",
      );
      deleteGalleryStmt.run(id);
  
      const deleteContentStmt = db.prepare("DELETE FROM content WHERE id = ?");
      const result = deleteContentStmt.run(id);
  
      if (result.changes > 0) {
        await generateStaticData();
        res.json({
          success: true,
          message: "Content and associated gallery images deleted successfully.",
        });
      } else {
        res.status(404).json({ success: false, message: "Content not found" });
      }
    } catch (error) {
      console.error(`❌ Error deleting content ${req.params.id}:`, error);
      res
        .status(500)
        .json({
          success: false,
          message: "Failed to delete content and associated gallery images.",
        });
    }
});
  
router.delete("/gallery-images/:id", async (req, res) => {
      try {
          const { id } = req.params;
          const stmt = db.prepare("DELETE FROM gallery_images WHERE id = ?");
          const result = stmt.run(id);
  
          if (result.changes > 0) {
              await generateStaticData();
              res.json({ success: true, message: "Image deleted successfully." });
          } else {
              res.status(404).json({ success: false, message: "Image not found." });
          }
      } catch (error) {
          console.error(`❌ Error deleting gallery image ${req.params.id}:`, error);
          res.status(500).json({ success: false, message: "Failed to delete image." });
      }
});

// Generic list endpoint for admin tables
router.get("/admin/list/:manager", (req, res) => {
    const manager = req.params.manager;
    const tableMap: Record<string, string> = {
      content: "content",
      achievements: "achievements",
      videos: "videos",
      library: "library_links",
      photoalbum: "content",
      graduates: "graduates",
    };
    const tableName = tableMap[manager];
  
    if (!tableName) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid manager type" });
    }
  
    try {
      let query;
      if (tableName === "content") {
        if (manager === "photoalbum") {
          query = `
                      SELECT id, title, date, category, subcategory
                      FROM ${tableName}
                      WHERE category = 'photoalbum'
                      ORDER BY date DESC
                  `;
        } else {
          query = `SELECT id, title, date, category, subcategory FROM ${tableName} ORDER BY date DESC`;
        }
      } else if (tableName === "library_links") {
        query = `SELECT id, title, category FROM ${tableName} ORDER BY title ASC`;
      } else if (tableName === "achievements") {
        query = `SELECT id, title, student_name, competition, date, place, category, city FROM ${tableName} ORDER BY date DESC`;
      } else if (tableName === "graduates") {
        query = `SELECT id, name, graduation_year, instrument, workplace, image_src, bio, is_featured FROM ${tableName} ORDER BY graduation_year DESC`;
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

export default router;
