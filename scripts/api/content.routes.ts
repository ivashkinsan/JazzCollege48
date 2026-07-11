import express from 'express';
import { upload } from './utils.ts';
import * as ContentService from './services/content.service.ts';

const router = express.Router();

// --- Public Routes ---

router.get("/news", (req, res) => {
    try {
        const result = ContentService.getPublicContent("news");
        res.json(result);
    } catch (error) {
        console.error(`Error fetching public content for news:`, error);
        res.status(500).json([]);
    }
});
  
router.get("/afisha", (req, res) => {
    try {
        const result = ContentService.getPublicContent("afisha");
        res.json(result);
    } catch (error) {
        console.error(`Error fetching public content for afisha:`, error);
        res.status(500).json([]);
    }
});

router.get("/photoalbums", (req, res) => {
    try {
        const formattedAlbums = ContentService.getPhotoAlbums();
        res.json(formattedAlbums);
    } catch (error) {
        console.error("Error fetching photo albums:", error);
        res.status(500).json([]);
    }
});

// --- Admin Routes ---

router.get("/content", (req, res) => {
    try {
        const adaptedContent = ContentService.getAllContentForAdmin();
        res.json(adaptedContent);
    } catch (error) {
        console.error("Error fetching content list:", error);
        res.status(500).json({ success: false, message: "Could not read content list from database." });
    }
});
  
router.get("/content/:id", (req, res) => {
    try {
        const content = ContentService.getContentById(req.params.id);
        if (!content) {
            return res.status(404).json({ success: false, message: "Content not found" });
        }
        res.json(content);
    } catch (error) {
        console.error(`Error fetching content for id ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: "Failed to fetch content details from database" });
    }
});
  
router.post("/content", upload.fields([ { name: "coverImage", maxCount: 1 }, { name: "galleryImages" }, ]), async (req, res) => {
    try {
        const newContentId = await ContentService.createContent(req.body, req.files);
        res.status(201).json({
            success: true,
            message: "Content successfully created in database.",
            id: newContentId,
        });
    } catch (error) {
        console.error("❌ Error creating content in database:", error);
        res.status(500).json({ success: false, message: "Failed to create content in database." });
    }
});

router.post("/content/:id", upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "galleryImages" }, ]), async (req, res) => {
    try {
        await ContentService.updateContent(req.params.id, req.body, req.files);
        res.status(200).json({ success: true, message: "Content successfully updated." });
    } catch (error) {
        console.error(`❌ Error updating content for id ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: "Failed to update content." });
    }
});

router.delete("/content/:id", async (req, res) => {
    try {
        const changes = await ContentService.deleteContent(req.params.id);
        if (changes > 0) {
            res.json({ success: true, message: "Content and associated gallery images deleted successfully." });
        } else {
            res.status(404).json({ success: false, message: "Content not found" });
        }
    } catch (error) {
        console.error(`❌ Error deleting content ${req.params.id}:`, error);
        res.status(500).json({ success: false, message: "Failed to delete content and associated gallery images." });
    }
});
  
router.delete("/gallery-images/:id", async (req, res) => {
    try {
        const changes = await ContentService.deleteGalleryImage(req.params.id);
        if (changes > 0) {
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
    try {
        const items = ContentService.getAdminList(req.params.manager);
        res.json(items);
    } catch (error: any) {
        console.error(`Error fetching list for ${req.params.manager}:`, error);
        if (error.message === 'Invalid manager type') {
            return res.status(400).json({ success: false, message: "Invalid manager type" });
        }
        res.status(500).json([]);
    }
});

export default router;
