import { Injectable } from '@nestjs/common';
import { decode, sign, verify } from 'jsonwebtoken';
import { appConfig } from '../../config';
import { UserEntity } from '../../database/entities';

@Injectable()
export class JwtService {
  makeTokenPair(user: UserEntity) {
    const payload = { id: user.id };

    const accessToken = sign(payload, appConfig.jwt.accessSecret, { expiresIn: '1h' });
    const refreshToken = sign(payload, appConfig.jwt.refreshSecret, { expiresIn: '1w' });

    return { accessToken, refreshToken };
  }

  verify(token: string, type: 'access' | 'refresh'): boolean {
    const secrets = {
      access: appConfig.jwt.accessSecret,
      refresh: appConfig.jwt.refreshSecret,
    };

    try {
      verify(token, secrets[type]);
      return true;
    } catch (err) {
      return false;
    }
  }

  decode(token: string) {
    const decoded = decode(token, { json: true });

    if (!decoded) {
      throw new Error('Invalid JWT');
    }

    return decoded;
  }
}
