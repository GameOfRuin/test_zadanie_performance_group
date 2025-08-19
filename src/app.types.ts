import { FastifyRequest } from 'fastify';
import { UserEntity } from './database/entities';

export type AuthorizedFastifyRequest = FastifyRequest & {
  user: UserEntity;
};
