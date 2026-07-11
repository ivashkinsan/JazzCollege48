
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentModule } from './content/content.module';
import { DatabaseModule } from './database/database.module';
import { GraduatesModule } from './graduates/graduates.module';
import { LibraryModule } from './library/library.module';

@Module({
  imports: [DatabaseModule, ContentModule, GraduatesModule, LibraryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
