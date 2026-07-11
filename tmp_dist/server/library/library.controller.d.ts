import { LibraryService } from './library.service.js';
export declare class LibraryController {
    private readonly libraryService;
    constructor(libraryService: LibraryService);
    create(body: any): Promise<{
        id: number | bigint;
    }>;
    findAll(category?: string): {
        links: unknown[];
        categories: any[];
    };
    findOne(id: string): {};
    update(id: string, body: any): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=library.controller.d.ts.map