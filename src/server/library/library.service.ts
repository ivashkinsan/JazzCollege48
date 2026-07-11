
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Database } from 'better-sqlite3';
import { generateStaticData } from '../utils/generate-static-data';

@Injectable()
export class LibraryService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: Database,
  ) {}

  findAll(category?: string) {
    let links;
    if (category && category !== 'Все') {
      const stmt = this.db.prepare(
        'SELECT * FROM library_links WHERE category = ? ORDER BY title',
      );
      links = stmt.all(category);
    } else {
      const stmt = this.db.prepare(
        'SELECT * FROM library_links ORDER BY category, title',
      );
      links = stmt.all();
    }

    const categoryStmt = this.db.prepare(
      'SELECT DISTINCT category FROM library_links ORDER BY category',
    );
    const categories = categoryStmt.all().map((cat: any) => cat.category);

    return { links, categories };
  }

  findOne(id: string) {
    const stmt = this.db.prepare('SELECT * FROM library_links WHERE id = ?');
    const link = stmt.get(id);
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    return link;
  }

  async create(body: any) {
    const { title, description, url, category } = body;
    const stmt = this.db.prepare(`
        INSERT INTO library_links (title, description, url, category)
        VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(title, description, url, category);
    await generateStaticData();
    return { id: result.lastInsertRowid };
  }

  async update(id: string, body: any) {
    const { title, description, url, category } = body;
    const stmt = this.db.prepare(`
        UPDATE library_links SET title = ?, description = ?, url = ?, category = ?
        WHERE id = ?
    `);
    const result = stmt.run(title, description, url, category, id);
    if (result.changes === 0) {
      throw new NotFoundException('Link not found');
    }
    await generateStaticData();
    return { success: true };
  }

  async remove(id: string) {
    const stmt = this.db.prepare('DELETE FROM library_links WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      throw new NotFoundException('Link not found');
    }
    await generateStaticData();
    return { success: true };
  }
}
