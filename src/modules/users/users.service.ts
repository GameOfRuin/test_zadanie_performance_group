import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { inject } from 'inversify';
import { redisRefreshToken } from '../../cache/cache.keys';
import { CacheService } from '../../cache/cache.servise';
import { UserEntity } from '../../database/entities';
import { JwtService } from '../jwt/jwt.service';
import { LoginDto, LoginTokensDto, RegisterDto } from './dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @inject(JwtService)
    private readonly jwtService: JwtService,
    @inject(CacheService)
    private readonly cacheService: CacheService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    this.logger.verbose(`Регистрация нового пользователя email=${dto.email}`);

    const exist = await UserEntity.findOne({ where: { email: dto.email } });
    if (exist) {
      throw new ConflictException('Такой email уже зарегистрирован');
    }

    dto.password = await hash(dto.password, 10);

    const newUser = await UserEntity.create({ ...dto });

    const { password, ...user } = newUser.toJSON();

    return user as RegisterResponseDto;
  }

  async login(dto: LoginDto): Promise<LoginTokensDto> {
    this.logger.verbose(`Пришли данные для логина. email = ${dto.email}`);

    const user = await UserEntity.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const { password } = user.toJSON();
    if (!(await compare(dto.password, password))) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return this.getTokenPair(user);
  }

  async logout(refreshToken: RefreshTokenDto['refreshToken'], user: UserEntity) {
    this.logger.verbose(`Пришел запрос на логаут`);

    const token = await this.cacheService.get(redisRefreshToken(refreshToken));
    if (!token) {
      throw new UnauthorizedException('Не верный токен');
    }

    const { id } = token;
    if (id !== user.id) {
      throw new UnauthorizedException('Не верный токен');
    }

    await this.cacheService.delete(redisRefreshToken(refreshToken));

    return { message: 'Произошел выход' };
  }

  async getTokenPair(user: UserEntity): Promise<LoginTokensDto> {
    const tokens = this.jwtService.makeTokenPair(user);
    const { id } = user;

    await this.cacheService.set(
      redisRefreshToken(tokens.refreshSecret),
      { id },
      {
        EX: 6000,
      },
    );

    return tokens;
  }

  async refresh(
    refreshToken: RefreshTokenDto['refreshToken'],
    user: UserEntity,
  ): Promise<LoginTokensDto> {
    await this.logout(refreshToken, user);

    return this.getTokenPair(user);
  }
}
