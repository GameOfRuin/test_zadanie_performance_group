import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UserIncludeDto {
  @IsNumber()
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: 1,
  })
  id: number;

  @IsString()
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Alex Parker',
  })
  name: string;
}
