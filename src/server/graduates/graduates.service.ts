
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Database } from 'better-sqlite3';
import { generateStaticData } from '../utils/generate-static-data';
import * as path from 'path';
import * as fs from 'fs/promises';
import { stripPublicPrefix } from '../utils/utils';

const GRADUATES_TARGET_ROOT = path.resolve(__dirname, '../../../../public/vipuskniki');

@Injectable()
export class GraduatesService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: Database,
  ) {}

  findAll() {
    const stmt = this.db.prepare('SELECT * FROM graduates ORDER BY graduation_year DESC');
    const graduates: any[] = stmt.all();
    return graduates.map(item => ({
      ...item,
      image: item.image_src,
      isFeatured: !!item.is_featured,
    }));
  }

  findOne(id: string) {
    const stmt = this.db.prepare('SELECT * FROM graduates WHERE id = ?');
    const graduate = stmt.get(id);
    if (!graduate) {
      throw new NotFoundException('Graduate not found');
    }
    return { ...graduate, is_featured: !!(graduate as any).is_featured };
  }

  async create(body: any, file: Express.Multer.File) {
    const { name, graduation_year, instrument, workplace, bio, is_featured } = body;
    let image_src = stripPublicPrefix(body.image_src);

    if (file) {
      const targetPath = path.join(GRADUATES_TARGET_ROOT, file.originalname);
      await fs.copyFile(file.path, targetPath);
      await fs.unlink(file.path);
      image_src = path.join('/vipuskniki', file.originalname).replace(/\\/g, '/');
    }

    const stmt = this.db.prepare(`
        INSERT INTO graduates (name, graduation_year, instrument, workplace, image_src, bio, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, graduation_year, instrument, workplace, image_src, bio, is_featured ? 1 : 0);
    await generateStaticData();
    return { id: result.lastInsertRowid };
  }

  async update(id: string, body: any, file: Express.Multer.File) {
    const { name, graduation_year, instrument, workplace, bio, is_featured } = body;
    let image_src = stripPublicPrefix(body.image_src);

    if (file) {
      const targetPath = path.join(GRADUATES_TARGET_ROOT, file.originalname);
      await fs.copyFile(file.path, targetPath);
      await fs.unlink(file.path);
      image_src = path.join('/vipuskniki', file.originalname).replace(/\\/g, '/');
    }

    const stmt = this.db.prepare(`
        UPDATE graduates SET name = ?, graduation_year = ?, instrument = ?, workplace = ?, image_src = ?, bio = ?, is_featured = ?
        WHERE id = ?
    `);
    const result = stmt.run(
        name, graduation_year, instrument, workplace, image_src, bio,
        (is_featured === 'true' || is_featured === '1' || is_featured === true) ? 1 : 0,
        id
    );

    if (result.changes === 0) {
      throw new NotFoundException('Graduate not found');
    }
    await generateStaticData();
    return { success: true };
  }

  async remove(id: string) {
    const stmt = this.db.prepare('DELETE FROM graduates WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      throw new NotFoundException('Graduate not found');
    }
    await generateStaticData();
    return { success: true };
  }
}
