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
import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GraduatesService } from './graduates.service.js';
let GraduatesController = class GraduatesController {
    graduatesService;
    constructor(graduatesService) {
        this.graduatesService = graduatesService;
    }
    create(body, file) {
        return this.graduatesService.create(body, file);
    }
    findAll() {
        return this.graduatesService.findAll();
    }
    findOne(id) {
        return this.graduatesService.findOne(id);
    }
    update(id, body, file) {
        return this.graduatesService.update(id, body, file);
    }
    remove(id) {
        return this.graduatesService.remove(id);
    }
};
__decorate([
    Post(),
    UseInterceptors(FileInterceptor('image')),
    __param(0, Body()),
    __param(1, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GraduatesController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GraduatesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GraduatesController.prototype, "findOne", null);
__decorate([
    Post(':id'),
    UseInterceptors(FileInterceptor('image')),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], GraduatesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GraduatesController.prototype, "remove", null);
GraduatesController = __decorate([
    Controller('api/graduates'),
    __metadata("design:paramtypes", [GraduatesService])
], GraduatesController);
export { GraduatesController };
//# sourceMappingURL=graduates.controller.js.map