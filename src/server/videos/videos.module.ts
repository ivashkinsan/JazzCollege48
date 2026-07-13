import { Module } from '@nestjs/common';
import { VideosService } from './videos.service.js';
import { VideosController } from './videos.controller.js';
import { DatabaseModule } from '../database/database.module.js'; // Import DatabaseModule

@Module({
  imports: [DatabaseModule], // Add DatabaseModule to imports
  providers: [VideosService],
  controllers: [VideosController],
  exports: [VideosService], // Export if other modules need to use it
})
export class VideosModule {}
