
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ContentModule } from './content/content.module.js';
import { DatabaseModule } from './database/database.module.js';
import { GraduatesModule } from './graduates/graduates.module.js';
import { LibraryModule } from './library/library.module.js';
import { VideosModule } from './videos/videos.module.js';
import { AchievementsModule } from './achievements/achievements.module.js';
import { AdminModule } from './admin/admin.module.js';

@Module({
  imports: [DatabaseModule, ContentModule, GraduatesModule, LibraryModule, VideosModule, AdminModule, AchievementsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
