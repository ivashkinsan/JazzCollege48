import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { Database } from 'better-sqlite3';
import { generateStaticData } from '../utils/generate-static-data.js';

@Injectable()
export class VideosService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: Database,
  ) {}

  async findAll() {
    const stmt = this.db.prepare('SELECT * FROM videos ORDER BY date DESC');
    return stmt.all();
  }

  async findOne(id: string) {
    const stmt = this.db.prepare('SELECT * FROM videos WHERE id = ?');
    const video = stmt.get(id);
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return video;
  }

  async create(body: any) {
    const { title, description, video_url, date, source } = body;
    if (!title || !video_url || !date) {
      throw new BadRequestException('Title, video_url, and date are required.');
    }
    const stmt = this.db.prepare(`
      INSERT INTO videos (title, description, video_url, date, source)
      VALUES (@title, @description, @video_url, @date, @source)
    `);
    const result = stmt.run({
      title,
      description: description || null,
      video_url,
      date,
      source: source || null,
    });
    await generateStaticData();
    return { id: result.lastInsertRowid, ...body };
  }

  async update(id: string, body: any) {
    const { title, description, video_url, date, source } = body;
    if (!title || !video_url || !date) {
      throw new BadRequestException('Title, video_url, and date are required.');
    }

    const stmt = this.db.prepare(`
      UPDATE videos
      SET title = @title, description = @description, video_url = @video_url, date = @date, source = @source
      WHERE id = @id
    `);
    const result = stmt.run({
      title,
      description: description || null,
      video_url,
      date,
      source: source || null,
      id: id,
    });

    if (result.changes === 0) {
      throw new NotFoundException(`Video with ID ${id} not found or no changes made.`);
    }
    await generateStaticData();
    return { success: true, message: `Video with ID ${id} updated successfully` };
  }

  async remove(id: string) {
    const stmt = this.db.prepare('DELETE FROM videos WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    // Re-generate static data if needed after deletion
    await generateStaticData(); // Assuming generateStaticData includes videos.json
    return { success: true, message: `Video with ID ${id} deleted successfully` };
  }
}
