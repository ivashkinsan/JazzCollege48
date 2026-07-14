import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service.js';
import { AchievementsController } from './achievements.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  providers: [AchievementsService],
  controllers: [AchievementsController],
  exports: [AchievementsService],
})
export class AchievementsModule {}
