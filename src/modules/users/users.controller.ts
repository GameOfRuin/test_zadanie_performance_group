import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { JwtGuard } from '../../guards/jwt.guard';
import { LoginDto, LoginTokensDto, RegisterDto } from './dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
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
    type: RefreshTokenDto,
    description: 'message: Выполнен выход',
  })
  @ApiUnauthorizedResponse({ description: 'Неверный email или пароль' })
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto, @Req() request: FastifyRequest) {
    return await this.userService.logout(dto.refreshToken, request.user);
  }

  @ApiOperation({ summary: 'бновление refresh-token' })
  @ApiCreatedResponse({
    type: RefreshTokenDto,
    description: 'Refresh-token обновлен',
  })
  @ApiUnauthorizedResponse({ description: 'Неизвестый refresh-token' })
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto, @Req() request: FastifyRequest) {
    return await this.userService.refresh(dto.refreshToken, request.user);
  }
}
