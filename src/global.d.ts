import { UserEntity } from './database/entities';

declare module 'fastify' {
  interface FastifyRequest {
    user: UserEntity;
  }
}
