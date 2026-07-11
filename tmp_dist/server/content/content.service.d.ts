import type { Database } from 'better-sqlite3';
export declare class ContentService {
    private db;
    constructor(db: Database);
    getPublicContent(category: 'news' | 'afisha'): {
        id: any;
        slug: any;
        title: any;
        date: any;
        description: any;
        content: any;
        category: any;
        cover: {} | null;
        gallery: unknown[];
    }[];
    getPhotoAlbums(): {
        albumId: any;
        albumTitle: any;
        albumDate: any;
        albumCategory: any;
        photos: {
            id: string;
            src: any;
            title: any;
        }[];
    }[];
    getAdminList(manager: string): unknown[];
    getContentById(id: string): any;
    createContent(body: any, files: any): Promise<number | bigint>;
    updateContent(id: string, body: any, files: any): Promise<{
        success: boolean;
    }>;
    deleteContent(id: string): Promise<number>;
    deleteGalleryImage(id: string): Promise<number>;
}
//# sourceMappingURL=content.service.d.ts.map