import express from 'express';
import db from './db.ts';
import { upload, stripPublicPrefix, createSlug } from './utils.ts';
import { generateStaticData } from '../generate-static-data.ts';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const GRADUATES_TARGET_ROOT = path.resolve(
  __dirname,
  "../../public/vipuskniki",
);

// Public endpoint
router.get("/graduates", (req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM graduates ORDER BY graduation_year DESC");
      const graduates = stmt.all();
      const adaptedGraduates = graduates.map((item: any) => ({
        ...item,
        image: item.image_src,
        isFeatured: !!item.is_featured,
      }));
      res.json(adaptedGraduates);
    } catch (error) {
      console.error(`Error fetching graduates:`, error);
      res.status(500).json([]);
    }
});

// Admin endpoints
router.get("/graduates/:id", (req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM graduates WHERE id = ?");
      const graduate = stmt.get(req.params.id);
      if (graduate) {
        res.json({ ...graduate, is_featured: !!(graduate as any).is_featured });
      } else {
        res.status(404).json({ success: false, message: "Graduate not found" });
      }
    } catch (error) {
      console.error(`Error fetching graduate ${req.params.id}:`, error);
      res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/graduates", upload.single("image"), async (req, res) => {
    try {
      const { name, graduation_year, instrument, workplace, bio, is_featured } =
        req.body;
      let image_src = stripPublicPrefix(req.body.image_src);
  
      if (req.file) {
        const targetPath = path.join(
          GRADUATES_TARGET_ROOT,
          req.file.originalname,
        );
        await fs.copyFile(req.file.path, targetPath);
        await fs.unlink(req.file.path);
        image_src = path
          .join("/vipuskniki", req.file.originalname)
          .replace(/\\/g, "/");
      }
  
      const stmt = db.prepare(`
              INSERT INTO graduates (name, graduation_year, instrument, workplace, image_src, bio, is_featured)
              VALUES (?, ?, ?, ?, ?, ?, ?)
          `);
      const result = stmt.run(
        name,
        graduation_year,
        instrument,
        workplace,
        image_src,
        bio,
        is_featured ? 1 : 0,
      );
      await generateStaticData();
      res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      console.error("Error creating graduate:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to create graduate" });
    }
});

router.post("/graduates/:id", upload.single("image"), async (req, res) => {
    try {
      const { name, graduation_year, instrument, workplace, bio, is_featured } =
        req.body;
      let image_src = stripPublicPrefix(req.body.image_src);
  
      if (req.file) {
        const targetPath = path.join(
          GRADUATES_TARGET_ROOT,
          req.file.originalname,
        );
        await fs.copyFile(req.file.path, targetPath);
        await fs.unlink(req.file.path);
        image_src = path
          .join("/vipuskniki", req.file.originalname)
          .replace(/\\/g, "/");
      }
      const stmt = db.prepare(`
              UPDATE graduates 
              SET name = ?, graduation_year = ?, instrument = ?, workplace = ?, image_src = ?, bio = ?, is_featured = ?
              WHERE id = ?
          `);
      const result = stmt.run(
        name,
        graduation_year,
        instrument,
        workplace,
        image_src,
        bio,
        (is_featured === 'true' || is_featured === '1' || is_featured === true) ? 1 : 0,
        req.params.id,
      );
      if (result.changes > 0) {
        await generateStaticData();
        res.json({ success: true });
      } else {
        res.status(404).json({ success: false, message: "Graduate not found" });
      }
    } catch (error) {
      console.error(`Error updating graduate ${req.params.id}:`, error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update graduate" });
    }
});

router.delete("/graduates/:id", async (req, res) => {
    try {
      const stmt = db.prepare("DELETE FROM graduates WHERE id = ?");
      const result = stmt.run(req.params.id);
      if (result.changes > 0) {
        await generateStaticData();
        res.json({ success: true });
      } else {
        res.status(404).json({ success: false, message: "Graduate not found" });
      }
    } catch (error) {
      console.error(`Error deleting graduate ${req.params.id}:`, error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete graduate" });
    }
});

export default router;
