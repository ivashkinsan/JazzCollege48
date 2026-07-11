
import { Module } from '@nestjs/common';
import { LibraryService } from './library.service.js';
import { LibraryController } from './library.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
