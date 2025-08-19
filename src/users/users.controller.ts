import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { RegisterDto } from './dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { UserService } from './users.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Регистрация нового пользователя',
    description: 'Создаёт нового пользователя в системе.',
  })
  @ApiCreatedResponse({
    type: RegisterResponseDto,
    description: 'Пользователь успешно зарегистрирован',
  })
  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.userService.register(dto);
  }
}
