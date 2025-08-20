import { LoginTokensDto } from '../modules/users/dto';

export const redisRefreshToken = (refreshToken: LoginTokensDto['refreshSecret']) =>
  `${refreshToken}`;
