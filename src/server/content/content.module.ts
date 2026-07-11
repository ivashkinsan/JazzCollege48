
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './tmp/uploads', // A temporary folder
        filename: (req, file, cb) => {
          // Ensure original filename is preserved with correct encoding
          const filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
