import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginTokensDto {
  @ApiProperty({
    example: 'accessSecret',
  })
  @IsString()
  accessSecret: string;

  @ApiProperty({
    example: 'refreshSecret',
  })
  @IsString()
  refreshSecret: string;
}
