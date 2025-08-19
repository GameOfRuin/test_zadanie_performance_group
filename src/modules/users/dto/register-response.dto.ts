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
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'Alex Parker',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    example: 'Alex Parker',
  })
  @IsDate()
  createdAt: Date;
}
