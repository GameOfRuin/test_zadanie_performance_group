import { ArticlesEntity } from '../database/entities';
import { ArticleFindAllDto } from '../modules/article/dto';
import { LoginTokensDto } from '../modules/users/dto';

export const redisRefreshToken = (refreshToken: LoginTokensDto['refreshSecret']) =>
  `${refreshToken}`;
export const redisArticleKey = (id: ArticlesEntity['id']) => `article:${id}`;
export const redisArticlesKey = (query: ArticleFindAllDto) =>
  `tasks:limit=${query.limit}:offset=${query.offset}:sortBy=${query.sortBy}:sortDirection=${query.sortDirection}:tags=${query.tags}`;
