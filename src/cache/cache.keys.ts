import { ArticlesEntity } from '../database/entities';
import { LoginTokensDto } from '../modules/users/dto';

export const redisRefreshToken = (refreshToken: LoginTokensDto['refreshSecret']) =>
  `${refreshToken}`;
export const redisArticleKey = (articleId: ArticlesEntity['id']) =>
  `articleId:${articleId}`;
