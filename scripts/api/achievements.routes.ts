import express from 'express';
import db from './db.ts';
import { upload, stripPublicPrefix } from './utils.ts';
import { generateStaticData } from '../generate-static-data.ts';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const ACHIEVEMENTS_TARGET_ROOT = path.resolve(
  __dirname,
  "../../public/Diploms",
);

// Public endpoint
router.get("/achievements", (req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM achievements ORDER BY date DESC");
      const achievements = stmt.all();
      const adaptedAchievements = achievements.map((item: any) => ({
        ...item,
        image: item.image_src,
      }));
      res.json(adaptedAchievements);
    } catch (error) {
      console.error(`Error fetching achievements:`, error);
      res.status(500).json([]);
    }
});

// Admin endpoints
router.get("/achievements/:id", (req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM achievements WHERE id = ?");
      const achievement = stmt.get(req.params.id);
      if (achievement) {
        res.json(achievement);
      } else {
        res
          .status(404)
          .json({ success: false, message: "Achievement not found" });
      }
    } catch (error) {
      console.error(`Error fetching achievement ${req.params.id}:`, error);
      res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/achievements", upload.single("image"), async (req, res) => {
    try {
      const { title, student_name, competition, date, place, category, city } =
        req.body;
      let image_src = stripPublicPrefix(req.body.image_src);
  
      if (req.file) {
        const targetPath = path.join(
          ACHIEVEMENTS_TARGET_ROOT,
          req.file.originalname,
        );
        await fs.rename(req.file.path, targetPath);
        image_src = path
          .join("/Diploms", req.file.originalname)
          .replace(/\\/g, "/");
      }
  
      const stmt = db.prepare(`
              INSERT INTO achievements (title, student_name, competition, date, place, category, image_src, city)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `);
      const result = stmt.run(
        title,
        student_name,
        competition,
        date,
        place,
        category,
        image_src,
        city,
      );
      await generateStaticData();
      res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      console.error("Error creating achievement:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to create achievement" });
    }
});

router.post("/achievements/:id", upload.single("image"), async (req, res) => {
    try {
      const { title, student_name, competition, date, place, category, city } =
        req.body;
      let image_src = stripPublicPrefix(req.body.image_src);
  
      if (req.file) {
        const targetPath = path.join(
          ACHIEVEMENTS_TARGET_ROOT,
          req.file.originalname,
        );
        await fs.rename(req.file.path, targetPath);
        image_src = path
          .join("/Diploms", req.file.originalname)
          .replace(/\\/g, "/");
      }
      const stmt = db.prepare(`
              UPDATE achievements 
              SET title = ?, student_name = ?, competition = ?, date = ?, place = ?, category = ?, image_src = ?, city = ?
              WHERE id = ?
          `);
      const result = stmt.run(
        title,
        student_name,
        competition,
        date,
        place,
        category,
        image_src,
        city,
        req.params.id,
      );
      if (result.changes > 0) {
        await generateStaticData();
        res.json({ success: true });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Achievement not found" });
      }
    } catch (error) {
      console.error(`Error updating achievement ${req.params.id}:`, error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update achievement" });
    }
});

router.delete("/achievements/:id", async (req, res) => {
    try {
      const stmt = db.prepare("DELETE FROM achievements WHERE id = ?");
      const result = stmt.run(req.params.id);
      if (result.changes > 0) {
        await generateStaticData();
        res.json({ success: true });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Achievement not found" });
      }
    } catch (error) {
      console.error(`Error deleting achievement ${req.params.id}:`, error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete achievement" });
    }
});

export default router;
