import { Module } from '@nestjs/common';
import { CacheService } from '../../cache/cache.service';
import { JwtService } from '../jwt/jwt.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtService, CacheService],
})
export class UserModule {}
