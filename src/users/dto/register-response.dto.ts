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
  @ApiProperty({
    example: 'john@gmail.com',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'john@gmail.com',
  })
  @IsEmail({})
  email: string;

  @ApiProperty({
    example: 'Alex Parker',
    description: 'Полное имя пользователя, от 2 до 50 символов.',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  createdAt: Date;
}
