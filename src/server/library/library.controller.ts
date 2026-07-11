
import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { LibraryService } from './library.service.js';

@Controller('api/library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post()
  create(@Body() body: any) {
    return this.libraryService.create(body);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    return this.libraryService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.libraryService.findOne(id);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.libraryService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libraryService.remove(id);
  }
}
