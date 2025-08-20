import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email пользователя для входа',
    example: 'john@gmail.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @ApiProperty({
    description: 'Пароль пользователя (6–255 символов)',
    example: 'PasswordS123',
  })
  password: string;
}
