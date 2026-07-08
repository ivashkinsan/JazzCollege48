import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, "../../src/data/database.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

console.log("Database connection established.");

export default db;
