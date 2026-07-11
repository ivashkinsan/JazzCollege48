var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { generateStaticData } from '../utils/generate-static-data.js';
import * as path from 'path';
import * as fs from 'fs/promises';
import { stripPublicPrefix } from '../utils/utils.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GRADUATES_TARGET_ROOT = path.resolve(__dirname, '../../../../public/vipuskniki');
let GraduatesService = class GraduatesService {
    db;
    constructor(db) {
        this.db = db;
    }
    findAll() {
        const stmt = this.db.prepare('SELECT * FROM graduates ORDER BY graduation_year DESC');
        const graduates = stmt.all();
        return graduates.map(item => ({
            ...item,
            image: item.image_src,
            isFeatured: !!item.is_featured,
        }));
    }
    findOne(id) {
        const stmt = this.db.prepare('SELECT * FROM graduates WHERE id = ?');
        const graduate = stmt.get(id);
        if (!graduate) {
            throw new NotFoundException('Graduate not found');
        }
        return { ...graduate, is_featured: !!graduate.is_featured };
    }
    async create(body, file) {
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
    async update(id, body, file) {
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
        const result = stmt.run(name, graduation_year, instrument, workplace, image_src, bio, (is_featured === 'true' || is_featured === '1' || is_featured === true) ? 1 : 0, id);
        if (result.changes === 0) {
            throw new NotFoundException('Graduate not found');
        }
        await generateStaticData();
        return { success: true };
    }
    async remove(id) {
        const stmt = this.db.prepare('DELETE FROM graduates WHERE id = ?');
        const result = stmt.run(id);
        if (result.changes === 0) {
            throw new NotFoundException('Graduate not found');
        }
        await generateStaticData();
        return { success: true };
    }
};
GraduatesService = __decorate([
    Injectable(),
    __param(0, Inject('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [Object])
], GraduatesService);
export { GraduatesService };
//# sourceMappingURL=graduates.service.js.map