import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'john@gmail.com' })
  email: string;

  @ApiProperty({
    example: 'PasswordS',
    description: 'Пароль должен быть не менее 6 символов и максимум 256',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
