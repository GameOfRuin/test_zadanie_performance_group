import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshTokenDto {
  @IsJWT()
  @ApiProperty({
    description:
      'Refresh-токен пользователя для обновления access-токена или выхода из системы',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUwMjMwODgzLCJleHAiOjE3NTA4MzU2ODN9.eFBld_1TdNaIUoE7v-r6Rp0JDSqKOPnBZm-7SXdYLcE',
  })
  refreshToken: string;
}
