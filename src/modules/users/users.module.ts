import { Module } from '@nestjs/common';
import { CacheService } from '../../cache/cache.servise';
import { JwtService } from '../jwt/jwt.service';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtService, CacheService],
})
export class UserModule {}
