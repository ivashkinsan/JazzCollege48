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
let LibraryService = class LibraryService {
    db;
    constructor(db) {
        this.db = db;
    }
    findAll(category) {
        let links;
        if (category && category !== 'Все') {
            const stmt = this.db.prepare('SELECT * FROM library_links WHERE category = ? ORDER BY title');
            links = stmt.all(category);
        }
        else {
            const stmt = this.db.prepare('SELECT * FROM library_links ORDER BY category, title');
            links = stmt.all();
        }
        const categoryStmt = this.db.prepare('SELECT DISTINCT category FROM library_links ORDER BY category');
        const categories = categoryStmt.all().map((cat) => cat.category);
        return { links, categories };
    }
    findOne(id) {
        const stmt = this.db.prepare('SELECT * FROM library_links WHERE id = ?');
        const link = stmt.get(id);
        if (!link) {
            throw new NotFoundException('Link not found');
        }
        return link;
    }
    async create(body) {
        const { title, description, url, category } = body;
        const stmt = this.db.prepare(`
        INSERT INTO library_links (title, description, url, category)
        VALUES (?, ?, ?, ?)
    `);
        const result = stmt.run(title, description, url, category);
        await generateStaticData();
        return { id: result.lastInsertRowid };
    }
    async update(id, body) {
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
    async remove(id) {
        const stmt = this.db.prepare('DELETE FROM library_links WHERE id = ?');
        const result = stmt.run(id);
        if (result.changes === 0) {
            throw new NotFoundException('Link not found');
        }
        await generateStaticData();
        return { success: true };
    }
};
LibraryService = __decorate([
    Injectable(),
    __param(0, Inject('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [Object])
], LibraryService);
export { LibraryService };
//# sourceMappingURL=library.service.js.map