
import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GraduatesService } from './graduates.service.js';

@Controller('api/graduates')
export class GraduatesController {
  constructor(private readonly graduatesService: GraduatesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.graduatesService.create(body, file);
  }

  @Get()
  findAll() {
    return this.graduatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.graduatesService.findOne(id);
  }

  @Post(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.graduatesService.update(id, body, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.graduatesService.remove(id);
  }
}
