import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUwMjMwODgzLCJleHAiOjE3NTA4MzU2ODN9.eFBld_1TdNaIUoE7v-r6Rp0JDSqKOPnBZm-7SXdYLcE',
  })
  @IsJWT()
  refreshToken: string;
}
