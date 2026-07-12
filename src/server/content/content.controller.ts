
import { Controller, Get, Param, Post, Delete, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ContentService } from './content.service.js';

@Controller('api') // Base path for all routes in this controller
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('admin/list/content')
  getAdminContentList() {
    return this.contentService.getAdminContentList();
  }

  @Get('news')
  getNews() {
    return this.contentService.getPublicContent('news');
  }

  @Get('afisha')
  getAfisha() {
    return this.contentService.getPublicContent('afisha');
  }

  @Get('photoalbums')
  getPhotoAlbums() {
    return this.contentService.getPhotoAlbums();
  }

  @Get('content/:id')
  getContentById(@Param('id') id: string) {
    return this.contentService.getContentById(id);
  }

  @Post('content')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages' },
  ]))
  createContent(@Body() body: any, @UploadedFiles() files: any) {
    return this.contentService.createContent(body, files);
  }

  @Post('content/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages' },
  ]))
  updateContent(@Param('id') id: string, @Body() body: any, @UploadedFiles() files: any) {
    return this.contentService.updateContent(id, body, files);
  }

  @Delete('content/:id')
  deleteContent(@Param('id') id: string) {
    return this.contentService.deleteContent(id);
  }

  @Delete('gallery-images/:id')
  deleteGalleryImage(@Param('id') id: string) {
    return this.contentService.deleteGalleryImage(id);
  }
}
