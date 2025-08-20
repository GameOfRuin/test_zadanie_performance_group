import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'Электронная почта пользователя, должна быть уникальной и валидной.',
  })
  @IsEmail({}, { message: 'Email должен быть валидным' })
  email: string;

  @ApiProperty({
    example: 'Alex Parker',
    description: 'Полное имя пользователя, от 2 до 50 символов.',
  })
  @IsString({ message: 'Имя должно быть строкой' })
  @MinLength(2, { message: 'Имя должно быть не менее 2 символов' })
  @MaxLength(50, { message: 'Имя должно быть максимум 50 символов' })
  name: string;

  @ApiProperty({
    example: 'PasswordS123',
    description:
      'Пароль должен быть от 6 до 255 символов. Рекомендуется включать буквы и цифры.',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  @MaxLength(255, { message: 'Пароль должен быть максимум 255 символов' })
  password: string;
}
