import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthorizedFastifyRequest } from '../app.types';
import { UserEntity } from '../database/entities';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest<AuthorizedFastifyRequest>();

    return request.user;
  },
);
