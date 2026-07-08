import express from 'express';
import db from './db.ts';
import { generateStaticData } from '../generate-static-data.ts';

const router = express.Router();

router.get("/videos", (req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM videos ORDER BY date DESC");
      const videos = stmt.all();
      const adaptedVideos = videos.map((item: any) => ({
        ...item,
        videoUrl: item.video_url,
      }));
      res.json(adaptedVideos);
    } catch (error) {
      console.error(`Error fetching videos:`, error);
      res.status(500).json([]);
    }
});

router.get("/videos/:id", (req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM videos WHERE id = ?");
      const video = stmt.get(req.params.id);
      if (video) {
        res.json(video);
      } else {
        res.status(404).json({ success: false, message: "Video not found" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/videos", async (req, res) => {
    try {
      const { title, description, video_url, date, source } = req.body;
      const stmt = db.prepare(`
              INSERT INTO videos (title, description, video_url, date, source)
              VALUES (?, ?, ?, ?, ?)
          `);
      const result = stmt.run(title, description, video_url, date, source);
      await generateStaticData();
      res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      console.error("Error creating video:", error);
      res.status(500).json({ success: false, message: "Failed to create video" });
    }
});

router.post("/videos/:id", async (req, res) => {
    try {
      const { title, description, video_url, date, source } = req.body;
      const stmt = db.prepare(`
              UPDATE videos 
              SET title = ?, description = ?, video_url = ?, date = ?, source = ?
              WHERE id = ?
          `);
      const result = stmt.run(
        title,
        description,
        video_url,
        date,
        source,
        req.params.id,
      );
      if (result.changes > 0) {
        await generateStaticData();
        res.json({ success: true });
      } else {
        res.status(404).json({ success: false, message: "Video not found" });
      }
    } catch (error) {
      console.error(`Error updating video ${req.params.id}:`, error);
      res.status(500).json({ success: false, message: "Failed to update video" });
    }
});

router.delete("/videos/:id", async (req, res) => {
    try {
      const stmt = db.prepare("DELETE FROM videos WHERE id = ?");
      const result = stmt.run(req.params.id);
      if (result.changes > 0) {
        await generateStaticData();
        res.json({ success: true });
      } else {
        res.status(404).json({ success: false, message: "Video not found" });
      }
    } catch (error) {
      console.error(`Error deleting video ${req.params.id}:`, error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete video" });
    }
});

export default router;
