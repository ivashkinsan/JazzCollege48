import type { Database } from 'better-sqlite3';
export declare class LibraryService {
    private db;
    constructor(db: Database);
    findAll(category?: string): {
        links: unknown[];
        categories: any[];
    };
    findOne(id: string): {};
    create(body: any): Promise<{
        id: number | bigint;
    }>;
    update(id: string, body: any): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=library.service.d.ts.map