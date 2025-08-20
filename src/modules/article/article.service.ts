import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { inject } from 'inversify';
import { FindOptions, Includeable, Op } from 'sequelize';
import { redisArticleKey } from '../../cache/cache.keys';
import { CacheService } from '../../cache/cache.servise';
import { ArticlesEntity, UserEntity } from '../../database/entities';
import { TimeInSeconds } from '../../shared';
import { ArticleAllFindDto, CreateArticleDto } from './dto';
import { ArticleUpdateDto } from './dto/article-update.dto';

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

    return this.getArticleById(newArticle.id);
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

  async updateArticle(
    dto: ArticleUpdateDto,
    userId: UserEntity['id'],
    idArticle: ArticlesEntity['id'],
  ) {
    this.logger.log('Updating article');

    const article = await this.getArticleById(idArticle);

    if (article.authorId !== userId) {
      throw new NotFoundException('Invalid article id');
    }
    await ArticlesEntity.update(dto, {
      where: { id: idArticle },
    });

    await this.redis.delete(redisArticleKey(idArticle));

    return await this.getArticleById(idArticle);
  }

  async delete(userId: UserEntity['id'], idArticle: ArticlesEntity['id']) {
    this.logger.log('Deleting a article');

    const article = await this.getArticleById(idArticle);

    if (article.authorId !== userId) {
      throw new NotFoundException('Invalid article id');
    }

    await this.redis.delete(redisArticleKey(idArticle));
    await ArticlesEntity.destroy({
      where: { id: idArticle },
    });

    return {
      success: true,
    };
  }

  async getAllArticle(query: ArticleAllFindDto, id?: UserEntity['id']) {
    this.logger.log('Getting articles');

    const { limit, offset, sortDirection, sortBy, tags } = query;

    const options: FindOptions = {
      offset,
      limit,
      order: [[sortBy, sortDirection]],
      include: [...this.joinAuthor],
      where: { visibility: { [Op.eq]: 'public' } },
    };

    if (id) {
      options.where = {
        ...options.where,
        visibility: { [Op.in]: ['private', 'public'] },
      };
    }

    const tasks = await this.redis.get<ArticlesEntity>('3');

    if (tasks) {
      return tasks;
    }

    if (tags) {
      const likePattern = `%${tags}%`;
      options.where = {
        ...options.where,
        [Op.or]: {
          tags: { [Op.iLike]: likePattern },
        },
      };
    }

    const { rows, count: total } = await ArticlesEntity.findAndCountAll(options);

    const response = { total, limit, offset, rows };
    await this.redis.set('redisArticlesKey(query)', response, {
      EX: 5 * TimeInSeconds.minute,
    });

    return response;
  }
}
