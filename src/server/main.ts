
import 'reflect-metadata';
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./app.module');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

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
