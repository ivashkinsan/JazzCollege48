import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import type { Database } from 'better-sqlite3';
import { generateStaticData } from '../utils/generate-static-data.js';
import * as path from 'path';
import * as fs from 'fs/promises';
import { stripPublicPrefix } from '../utils/utils.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIPLOMAS_TARGET_ROOT = path.resolve(__dirname, '../../../public/Diploms');

@Injectable()
export class AchievementsService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: Database,
  ) {}

  findAll() {
    const stmt = this.db.prepare('SELECT * FROM achievements ORDER BY date DESC');
    return stmt.all();
  }

  findOne(id: number) {
    const stmt = this.db.prepare('SELECT * FROM achievements WHERE id = ?');
    const achievement = stmt.get(id);
    if (!achievement) {
      throw new NotFoundException(`Achievement with ID ${id} not found`);
    }
    return achievement;
  }

  async create(body: any, file?: Express.Multer.File) {
    const { title, student_name, competition, date, place, city, category } = body;
    let image_src = stripPublicPrefix(body.image_src || '');

    if (file) {
      const targetDir = path.join(DIPLOMAS_TARGET_ROOT);
      await fs.mkdir(targetDir, { recursive: true });
      const targetPath = path.join(targetDir, file.originalname);

      if (file.path) { // If multer used DiskStorage
          await fs.copyFile(file.path, targetPath);
          await fs.unlink(file.path); // Clean up temp file
      } else if (file.buffer) { // If multer used MemoryStorage
          await fs.writeFile(targetPath, file.buffer);
      } else {
          throw new BadRequestException('Invalid file upload data.');
      }

      image_src = path.join('/Diploms', file.originalname).replace(/\\/g, '/');
    }

    if (!title || !competition || !date || !place || !category) {
      throw new BadRequestException('Title, competition, date, place, and category are required.');
    }

    const stmt = this.db.prepare(`
        INSERT INTO achievements (title, student_name, competition, date, place, city, category, image_src)
        VALUES (@title, @student_name, @competition, @date, @place, @city, @category, @image_src)
    `);
    const result = stmt.run({ title, student_name, competition, date, place, city, category, image_src });
    await generateStaticData();
    return { id: result.lastInsertRowid };
  }

  async update(id: number, body: any, file?: Express.Multer.File) {
    const { title, student_name, competition, date, place, city, category } = body;
    let image_src = stripPublicPrefix(body.image_src || '');

    if (file) {
        const targetDir = path.join(DIPLOMAS_TARGET_ROOT);
        await fs.mkdir(targetDir, { recursive: true });
        const targetPath = path.join(targetDir, file.originalname);

        if (file.path) { // If multer used DiskStorage
            await fs.copyFile(file.path, targetPath);
            await fs.unlink(file.path); // Clean up temp file
        } else if (file.buffer) { // If multer used MemoryStorage
            await fs.writeFile(targetPath, file.buffer);
        } else {
            throw new BadRequestException('Invalid file upload data.');
        }
        
        image_src = path.join('/Diploms', file.originalname).replace(/\\/g, '/');
    }

    const stmt = this.db.prepare(`
        UPDATE achievements 
        SET title = @title, student_name = @student_name, competition = @competition, date = @date, 
            place = @place, city = @city, category = @category, image_src = @image_src
        WHERE id = @id
    `);
    const result = stmt.run({ title, student_name, competition, date, place, city, category, image_src, id });

    if (result.changes === 0) {
      throw new NotFoundException(`Achievement with ID ${id} not found or no changes made.`);
    }
    await generateStaticData();
    return { success: true };
  }

  async remove(id: number) {
    const stmt = this.db.prepare('DELETE FROM achievements WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      throw new NotFoundException(`Achievement with ID ${id} not found`);
    }
    await generateStaticData();
    return { success: true };
  }
}
