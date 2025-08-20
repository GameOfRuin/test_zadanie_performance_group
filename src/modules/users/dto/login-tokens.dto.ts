import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginTokensDto {
  @IsString()
  @ApiProperty({
    description: 'JWT Access-токен для авторизации пользователя',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessSecret: string;

  @IsString()
  @ApiProperty({
    description: 'JWT Refresh-токен для обновления access-токена',
    example: 'dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4...',
  })
  refreshSecret: string;
}
