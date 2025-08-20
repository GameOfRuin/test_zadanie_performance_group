import { Injectable, Logger } from '@nestjs/common';
import { inject } from 'inversify';
import { redisArticleKey } from '../../cache/cache.keys';
import { CacheService } from '../../cache/cache.servise';
import { ArticlesEntity, UserEntity } from '../../database/entities';
import { CreateArticleDto } from './dto';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger('Bootstrap');

  constructor(
    @inject(CacheService)
    private readonly redis: CacheService,
  ) {}

  async creatArticle(dto: CreateArticleDto, user: UserEntity) {
    this.logger.log('Creating a new article');

    const newArticle = await ArticlesEntity.create({ ...dto, authorId: user.id });

    await this.redis.set(redisArticleKey(newArticle.id), { newArticle }, { EX: 600 });

    return newArticle;
  }
}
