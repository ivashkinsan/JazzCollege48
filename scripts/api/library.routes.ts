import express from 'express';
import db from './db.ts';
import { generateStaticData } from '../generate-static-data.ts';

const router = express.Router();

router.get("/library", (req, res) => {
    const category = req.query.category as string;
    try {
      let links;
      if (category && category !== "Все") {
        const stmt = db.prepare(
          "SELECT * FROM library_links WHERE category = ? ORDER BY title",
        );
        links = stmt.all(category);
      } else {
        const stmt = db.prepare(
          "SELECT * FROM library_links ORDER BY category, title",
        );
        links = stmt.all();
      }
  
      const categoryStmt = db.prepare(
        "SELECT DISTINCT category FROM library_links ORDER BY category",
      );
      const categories = categoryStmt.all().map((cat: any) => cat.category);
  
      res.json({ links, categories });
    } catch (error) {
      console.error(`Error fetching library links:`, error);
      res.status(500).json({ links: [], categories: [] });
    }
});

router.get("/library/:id", (req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM library_links WHERE id = ?");
      const link = stmt.get(req.params.id);
      if (link) {
        res.json(link);
      } else {
        res.status(404).json({ success: false, message: "Link not found" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/library", async (req, res) => {
    try {
      const { title, description, url, category } = req.body;
      const stmt = db.prepare(`
              INSERT INTO library_links (title, description, url, category)
              VALUES (?, ?, ?, ?)
          `);
      const result = stmt.run(title, description, url, category);
      await generateStaticData();
      res.status(201).json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      console.error("Error creating library link:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to create library link" });
    }
});

router.post("/library/:id", async (req, res) => {
    try {
      const { title, description, url, category } = req.body;
      const stmt = db.prepare(`
              UPDATE library_links 
              SET title = ?, description = ?, url = ?, category = ?
              WHERE id = ?
          `);
      const result = stmt.run(title, description, url, category, req.params.id);
      if (result.changes > 0) {
        await generateStaticData();
        res.json({ success: true });
      } else {
        res.status(404).json({ success: false, message: "Link not found" });
      }
    } catch (error) {
      console.error(`Error updating library link ${req.params.id}:`, error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update library link" });
    }
});

router.delete("/library/:id", async (req, res) => {
    try {
      const stmt = db.prepare("DELETE FROM library_links WHERE id = ?");
      const result = stmt.run(req.params.id);
      if (result.changes > 0) {
        await generateStaticData();
        res.json({ success: true });
      } else {
        res.status(404).json({ success: false, message: "Link not found" });
      }
    } catch (error) {
      console.error(`Error deleting library link ${req.params.id}:`, error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete library link" });
    }
});

export default router;
