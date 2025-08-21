import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserEntity } from '../../database/entities';
import { User } from '../../decorators';
import { JwtGuard } from '../../guards/jwt.guard';
import { LoginDto, LoginTokensDto, RegisterDto, RegisterResponseDto } from './dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiCreatedResponse({
    type: RegisterResponseDto,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiBody({ type: RegisterDto, description: 'Данные для регистрации пользователя' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @ApiOperation({ summary: 'Логин пользователя' })
  @ApiOkResponse({
    type: LoginTokensDto,
    description: 'Пользователь успешно вошёл в систему и получил токены',
  })
  @ApiBody({ type: LoginDto, description: 'Email и пароль пользователя' })
  @ApiUnauthorizedResponse({ description: 'Неверный email или пароль' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Логаут пользователя' })
  @ApiOkResponse({ description: '{ message: Successfully logged out };' })
  @ApiBody({ type: RefreshTokenDto, description: 'Refresh-токен для выхода' })
  @ApiUnauthorizedResponse({
    description: 'Недействительный refresh-token или пользователь не авторизован',
  })
  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto, @User() user: UserEntity) {
    return await this.userService.logout(dto.refreshToken, user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление токенов пользователя' })
  @ApiOkResponse({
    type: LoginTokensDto,
    description: 'Новые access- и refresh-токены успешно выданы',
  })
  @ApiBody({ type: RefreshTokenDto, description: 'Refresh-токен для обновления токенов' })
  @ApiUnauthorizedResponse({ description: 'Неизвестный или просроченный refresh-token' })
  @UseGuards(JwtGuard)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto, @User() user: UserEntity) {
    return this.userService.refresh(dto.refreshToken, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiOkResponse({ description: '{ message: User successfully deleted }' })
  @Delete('/')
  async delete(@User() user: UserEntity) {
    return this.userService.delete(user.id);
  }
}
