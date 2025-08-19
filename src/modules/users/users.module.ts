import { Module } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
