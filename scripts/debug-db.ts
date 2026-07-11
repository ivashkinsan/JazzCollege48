
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../src/data/database.db');
const db = new Database(dbPath);

console.log('Querying for photoalbums...');
try {
  const stmt = db.prepare("SELECT * FROM content WHERE category = 'photoalbum'");
  const rows = stmt.all();
  
  if (rows.length === 0) {
    console.log('No rows found with category = "photoalbum".');
  } else {
    console.log('Found photoalbums:');
    console.log(rows);
  }

  console.log('Querying for all categories...');
  const catStmt = db.prepare('SELECT DISTINCT category, COUNT(*) as count FROM content GROUP BY category');
  const categories = catStmt.all();
  console.log('Category summary:');
  console.log(categories);

} catch (e) {
  console.error('An error occurred:', e);
} finally {
  db.close();
}
