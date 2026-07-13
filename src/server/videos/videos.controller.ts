import { Controller, Get, Param, Delete, Post, Body, Put } from '@nestjs/common';
import { VideosService } from './videos.service.js';

@Controller('api/videos') // Base path for videos
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.videosService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.videosService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }
}
