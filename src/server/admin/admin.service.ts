import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { Database } from 'better-sqlite3';

@Injectable()
export class AdminService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: Database,
  ) {}

  getAdminList(manager: string) {
    const tableMap: Record<string, string> = {
      achievements: "achievements",
      videos: "videos",
      library: "library_links",
      graduates: "graduates",
    };
    const tableName = tableMap[manager];
  
    if (!tableName) {
      throw new BadRequestException(`Invalid manager type: ${manager}`);
    }

    let query = `SELECT * FROM ${tableName}`;
    
    if (tableName === "graduates") {
      query += ` ORDER BY graduation_year DESC`;
    } else if (tableName === "library_links") {
      query += ` ORDER BY category, title`;
    } else if (tableName === 'achievements' || tableName === 'videos') {
      query += ` ORDER BY date DESC`;
    }
    
    const stmt = this.db.prepare(query);
    return stmt.all();
  }
}
