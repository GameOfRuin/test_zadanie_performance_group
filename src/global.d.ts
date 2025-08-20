import { UserEntity } from './database/entities';

declare module 'fastify' {
  interface FastifyRequest {
    user: UserEntity; // Делаем опциональным для безопасности
  }
}
