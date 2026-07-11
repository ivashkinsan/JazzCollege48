
import { Module } from '@nestjs/common';
import { GraduatesService } from './graduates.service';
import { GraduatesController } from './graduates.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GraduatesController],
  providers: [GraduatesService],
})
export class GraduatesModule {}
