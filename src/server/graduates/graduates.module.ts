
import { Module } from '@nestjs/common';
import { GraduatesService } from './graduates.service.js';
import { GraduatesController } from './graduates.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [GraduatesController],
  providers: [GraduatesService],
})
export class GraduatesModule {}
