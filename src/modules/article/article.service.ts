import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { inject } from 'inversify';
import { Includeable } from 'sequelize';
import { redisArticleKey } from '../../cache/cache.keys';
import { CacheService } from '../../cache/cache.servise';
import { ArticlesEntity, UserEntity } from '../../database/entities';
import { TimeInSeconds } from '../../shared';
import { CreateArticleDto } from './dto';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger('Bootstrap');

  constructor(
    @inject(CacheService)
    private readonly redis: CacheService,
  ) {}

  private readonly joinAuthor: Includeable[] = [
    {
      model: UserEntity,
      as: 'author',
      attributes: ['id', 'name'],
    },
  ];

  async creatArticle(dto: CreateArticleDto, user: UserEntity) {
    this.logger.log('Creating a new article');

    const newArticle = await ArticlesEntity.create({ ...dto, authorId: user.id });

    await this.redis.set(redisArticleKey(newArticle.id), { newArticle }, { EX: 600 });

    return newArticle;
  }
  async getArticleById(idArticle: ArticlesEntity['id']) {
    this.logger.log(`Чтение задачи по id=${idArticle}`);

    const cacheTask = await this.redis.get<ArticlesEntity>(redisArticleKey(idArticle));

    if (cacheTask) {
      return cacheTask;
    }

    const task = await ArticlesEntity.findOne({
      where: { id: idArticle },
      include: [...this.joinAuthor],
    });

    if (!task) {
      throw new NotFoundException('Такой задачи не найдено');
    }

    await this.redis.set(redisArticleKey(idArticle), task, {
      EX: 10 * TimeInSeconds.minute,
    });

    return task.toJSON();
  }
}
