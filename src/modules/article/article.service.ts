import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { inject } from 'inversify';
import { FindOptions, Includeable, Op } from 'sequelize';
import { redisArticleKey, redisArticlesKey } from '../../cache/cache.keys';
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

  async getArticleById(idArticle: ArticlesEntity['id'], userId?: UserEntity['id']) {
    this.logger.log(`Чтение задачи по id=${idArticle}`);

    const options: FindOptions = {
      where: { id: idArticle },
      include: [...this.joinAuthor],
    };

    if (userId) {
      options.where = {
        ...options.where,
        visibility: { [Op.in]: ['private', 'public'] },
      };
    } else {
      options.where = {
        ...options.where,
        visibility: { [Op.like]: 'public' },
      };
    }

    const cacheTask = await this.redis.get<ArticlesEntity>(redisArticleKey(idArticle));

    if (cacheTask) {
      if (cacheTask?.visibility === 'private') {
        if (!userId) {
          throw new NotFoundException(`Статья не найдена id=${idArticle}`);
        }
      }
      return cacheTask;
    }

    const task = await ArticlesEntity.findOne(options);

    if (!task) {
      throw new NotFoundException('Такой статьи не найдено');
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

    const article = await ArticlesEntity.findOne({
      where: { id: idArticle },
      raw: true,
    });
    if (!article) {
      throw new NotFoundException('Нельзя изменить задачу2');
    }

    if (article.authorId !== userId) {
      throw new NotFoundException('Нельзя изменить задачу');
    }
    await ArticlesEntity.update(dto, {
      where: { id: idArticle },
    });

    await this.redis.delete(redisArticleKey(idArticle));

    return await this.getArticleById(idArticle);
  }

  async delete(userId: UserEntity['id'], idArticle: ArticlesEntity['id']) {
    this.logger.log('Запрос на удаление статьи');

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

    const article = await this.redis.get(redisArticlesKey(query));

    if (article) {
      if (!id) {
        return article.rows.filter((r) => r.visibility === 'public');
      }
      return article;
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
    await this.redis.set(redisArticlesKey(query), response, {
      EX: 5 * TimeInSeconds.minute,
    });

    return response;
  }
}
