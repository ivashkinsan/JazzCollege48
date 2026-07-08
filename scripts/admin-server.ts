import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { generateStaticData } from "./generate-static-data.ts";
import apiRouter from "./api/index.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../../"))); // Serve static files from project root

// --- Initial Data Generation ---
generateStaticData();

// --- API Routes ---
app.use('/api', apiRouter);

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`🚀 Database-driven API server running on port ${PORT}`);
});
