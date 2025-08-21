import { ArticleEntity, UserEntity } from '../database/entities';
import { ArticleFindAllDto } from '../modules/article/dto';
import { LoginTokensDto } from '../modules/users/dto';

export const redisRefreshToken = (refreshToken: LoginTokensDto['refreshToken']) =>
  `${refreshToken}`;
export const redisArticleKey = (id: ArticleEntity['id']) => `article:${id}`;
export const redisArticlesKey = (query: ArticleFindAllDto, userId?: UserEntity['id']) =>
  `tasks:limit=${query.limit}:offset=${query.offset}:sortBy=${query.sortBy}:sortDirection=${query.sortDirection}:tags=${query.tags}:userId=${userId}`;
