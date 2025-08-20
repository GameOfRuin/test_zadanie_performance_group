import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterResponseDto {
  @IsNumber()
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: 1,
  })
  id: number;

  @IsEmail()
  @ApiProperty({
    description: 'Email зарегистрированного пользователя',
    example: 'john@gmail.com',
  })
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Alex Parker',
  })
  name: string;

  @IsDate()
  @ApiProperty({
    description: 'Дата и время создания пользователя',
    example: '2025-08-20T19:00:00.000Z',
  })
  createdAt: Date;

  @IsDate()
  @ApiProperty({
    description: 'Дата и время последнего обновления данных пользователя',
    example: '2025-08-20T19:15:00.000Z',
  })
  updatedAt: Date;
}
