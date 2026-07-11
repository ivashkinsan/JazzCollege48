import { GraduatesService } from './graduates.service.js';
export declare class GraduatesController {
    private readonly graduatesService;
    constructor(graduatesService: GraduatesService);
    create(body: any, file: Express.Multer.File): Promise<{
        id: number | bigint;
    }>;
    findAll(): any[];
    findOne(id: string): {
        is_featured: boolean;
    };
    update(id: string, body: any, file: Express.Multer.File): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=graduates.controller.d.ts.map