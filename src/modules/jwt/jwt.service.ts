import { Injectable } from '@nestjs/common';
import { decode, sign, verify } from 'jsonwebtoken';
import { UserEntity } from '../../database/entities';

@Injectable()
export class JwtService {
  makeTokenPair(user: UserEntity) {
    const payload = { id: user.id };

    const accessSecret = sign(payload, 'a-secret', { expiresIn: '1h' });
    const refreshSecret = sign(payload, 'r-secret', { expiresIn: '1w' });
    return { accessSecret, refreshSecret };
  }

  verify(token: string, type: 'access' | 'refresh'): boolean {
    const secrets = {
      access: 'a-secret',
      refresh: 'r-secret',
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
