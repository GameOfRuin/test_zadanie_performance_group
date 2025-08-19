import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const bootstrapSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Another Knowledge Base API')
    .setDescription('Backend сервис для хранения и управления статьями базы знаний.')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Введите JWT токен для доступа к защищённым эндпоинтам',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
};
