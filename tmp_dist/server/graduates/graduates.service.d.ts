import type { Database } from 'better-sqlite3';
export declare class GraduatesService {
    private db;
    constructor(db: Database);
    findAll(): any[];
    findOne(id: string): {
        is_featured: boolean;
    };
    create(body: any, file?: Express.Multer.File): Promise<{
        id: number | bigint;
    }>;
    update(id: string, body: any, file?: Express.Multer.File): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=graduates.service.d.ts.map