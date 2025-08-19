import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { bootstrapPipes, bootstrapSwagger } from './bootstrap';
import { appConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  bootstrapSwagger(app);
  bootstrapPipes(app);

  const logger = new Logger('Bootstrap');

  await app.listen(appConfig.port);
}
bootstrap();
