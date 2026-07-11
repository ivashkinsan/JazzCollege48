import { ContentService } from './content.service.js';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    getAdminList(manager: string): unknown[];
    getNews(): {
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
    getAfisha(): {
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
    getContentById(id: string): any;
    createContent(body: any, files: any): Promise<number | bigint>;
    updateContent(id: string, body: any, files: any): Promise<{
        success: boolean;
    }>;
    deleteContent(id: string): Promise<number>;
    deleteGalleryImage(id: string): Promise<number>;
}
//# sourceMappingURL=content.controller.d.ts.map