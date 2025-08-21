import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { inject } from 'inversify';
import { redisRefreshToken } from '../../cache/cache.keys';
import { CacheService } from '../../cache/cache.service';
import { UserEntity } from '../../database/entities';
import { TimeInSeconds } from '../../shared';
import { JwtService } from '../jwt/jwt.service';
import { LoginDto, RegisterDto } from './dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @inject(JwtService)
    private readonly jwtService: JwtService,
    @inject(CacheService)
    private readonly cacheService: CacheService,
  ) {}

  async register(dto: RegisterDto) {
    this.logger.verbose(`Registering new user email=${dto.email}`);

    const exist = await UserEntity.findOne({ where: { email: dto.email } });
    if (exist) {
      throw new ConflictException('This email is already registered');
    }

    dto.password = await hash(dto.password, 10);

    const newUser = await UserEntity.create({ ...dto });

    const { password, ...user } = newUser.toJSON();

    return user;
  }

  async login(dto: LoginDto) {
    this.logger.verbose(`Login attempt with email= ${dto.email}`);

    const user = await UserEntity.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password } = user.toJSON();
    if (!(await compare(dto.password, password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.getTokenPair(user);
  }

  async logout(refreshToken: RefreshTokenDto['refreshToken'], user: UserEntity) {
    this.logger.verbose(`Logout request received`);

    const token = await this.cacheService.get(redisRefreshToken(refreshToken));
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    const { id } = token;
    if (id !== user.id) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.cacheService.delete(redisRefreshToken(refreshToken));

    return { message: 'Successfully logged out' };
  }

  async getTokenPair(user: UserEntity) {
    const tokens = this.jwtService.makeTokenPair(user);
    const { id } = user;

    await this.cacheService.set(
      redisRefreshToken(tokens.refreshToken),
      { id },
      {
        EX: TimeInSeconds.day,
      },
    );

    return tokens;
  }

  async refresh(refreshToken: RefreshTokenDto['refreshToken'], user: UserEntity) {
    await this.logout(refreshToken, user);

    return this.getTokenPair(user);
  }

  async delete(id: UserEntity['id']) {
    this.logger.warn(`Request to delete user with id=${id}`);

    await UserEntity.destroy({ where: { id } });

    return { message: 'User successfully deleted' };
  }
}
