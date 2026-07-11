
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );
  app.enableCors(); // For now, enable basic CORS
  await app.listen(4000);
  console.log(`🚀 NestJS server running on http://localhost:4000`);
}
bootstrap();
