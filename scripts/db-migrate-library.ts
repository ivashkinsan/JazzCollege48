import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../src/data/database.db');
const libraryDataPath = path.resolve(__dirname, '../src/data/static/libraryLinks.ts');
const db = new Database(dbPath);

console.log('🚀 Migrating "library" data to SQLite...');

try {
    // 1. Read the data file as text
    const fileContent = fs.readFileSync(libraryDataPath, 'utf-8');

    // 2. Extract the array literal string using a regex
    const arrayRegex = /export const libraryCategories: LibraryCategory\[\] = (\[[\s\S]*?\]);/s;
    const match = fileContent.match(arrayRegex);
    if (!match || !match[1]) {
        throw new Error('Could not find the libraryCategories array in the data file.');
    }
    const arrayString = match[1];

    // 3. Evaluate the string to get the libraryCategories array object
    const libraryCategories = eval('(' + arrayString + ')');
    console.log(`   - Found ${libraryCategories.length} categories in the source file.`);

    // 4. Proceed with migration
    db.exec('DELETE FROM library_links');
    db.exec("DELETE FROM sqlite_sequence WHERE name = 'library_links';");
    console.log('   - Cleared existing library_links data.');

    const insertStmt = db.prepare(`
        INSERT INTO library_links (title, description, url, category)
        VALUES (@title, @description, @url, @category)
    `);

    let migratedCount = 0;
    db.transaction(() => {
        for (const category of libraryCategories) {
            for (const link of category.links) {
                insertStmt.run({
                    title: link.title,
                    description: link.description,
                    url: link.url,
                    category: category.categoryTitle,
                });
                migratedCount++;
            }
        }
    })();
    
    console.log(`✅ Migrated ${migratedCount} library link entries.`);

} catch (error) {
    console.error('❌ Failed to migrate library links:', error);
} finally {
    db.close();
    console.log('🎉 Library migration process finished.');
}
