import { INestApplication, ValidationPipe } from '@nestjs/common';

export const bootstrapPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
};
