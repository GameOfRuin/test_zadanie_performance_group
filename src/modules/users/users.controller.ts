import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto, LoginTokensDto, RegisterDto } from './dto';
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

  @ApiOperation({ summary: 'Логин' })
  @ApiCreatedResponse({
    type: LoginTokensDto,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiUnauthorizedResponse({ description: 'Неверный email или пароль' })
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginTokensDto> {
    return this.userService.login(dto);
  }

  @ApiOperation({ summary: 'Логаут пользователя' })
  @ApiCreatedResponse({
    type: LoginTokensDto,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiUnauthorizedResponse({ description: 'Неверный email или пароль' })
  @HttpCode(200)
  @Post('logout')
  async logout(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @ApiOperation({ summary: 'бновление refresh-token' })
  @ApiCreatedResponse({
    type: LoginTokensDto,
    description: 'Refresh-token обновлен',
  })
  @ApiUnauthorizedResponse({ description: 'Неизвестый refresh-token' })
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }
}
