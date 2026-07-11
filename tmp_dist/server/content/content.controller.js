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
import { Controller, Get, Param, Post, Delete, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ContentService } from './content.service.js';
let ContentController = class ContentController {
    contentService;
    constructor(contentService) {
        this.contentService = contentService;
    }
    getAdminList(manager) {
        return this.contentService.getAdminList(manager);
    }
    getNews() {
        return this.contentService.getPublicContent('news');
    }
    getAfisha() {
        return this.contentService.getPublicContent('afisha');
    }
    getPhotoAlbums() {
        return this.contentService.getPhotoAlbums();
    }
    getContentById(id) {
        return this.contentService.getContentById(id);
    }
    createContent(body, files) {
        return this.contentService.createContent(body, files);
    }
    updateContent(id, body, files) {
        return this.contentService.updateContent(id, body, files);
    }
    deleteContent(id) {
        return this.contentService.deleteContent(id);
    }
    deleteGalleryImage(id) {
        return this.contentService.deleteGalleryImage(id);
    }
};
__decorate([
    Get('admin/list/:manager'),
    __param(0, Param('manager')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "getAdminList", null);
__decorate([
    Get('news'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "getNews", null);
__decorate([
    Get('afisha'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "getAfisha", null);
__decorate([
    Get('photoalbums'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "getPhotoAlbums", null);
__decorate([
    Get('content/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "getContentById", null);
__decorate([
    Post('content'),
    UseInterceptors(FileFieldsInterceptor([
        { name: 'coverImage', maxCount: 1 },
        { name: 'galleryImages' },
    ])),
    __param(0, Body()),
    __param(1, UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "createContent", null);
__decorate([
    Post('content/:id'),
    UseInterceptors(FileFieldsInterceptor([
        { name: 'coverImage', maxCount: 1 },
        { name: 'galleryImages' },
    ])),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "updateContent", null);
__decorate([
    Delete('content/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "deleteContent", null);
__decorate([
    Delete('gallery-images/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "deleteGalleryImage", null);
ContentController = __decorate([
    Controller('api') // Base path for all routes in this controller
    ,
    __metadata("design:paramtypes", [ContentService])
], ContentController);
export { ContentController };
//# sourceMappingURL=content.controller.js.map