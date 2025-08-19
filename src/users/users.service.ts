import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserEntity } from '../database/entities';
import { RegisterDto } from './dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor() {}
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
}
