import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';

@Injectable()
export class OptionalJwtGuard extends JwtGuard {
  async canActivate(context: ExecutionContext) {
    try {
      return await super.canActivate(context);
    } catch {
      return true;
    }
  }
}