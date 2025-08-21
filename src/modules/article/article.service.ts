import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FindOptions, Includeable, Op } from 'sequelize';
import { redisArticleKey, redisArticlesKey } from '../../cache/cache.keys';
import { CacheService } from '../../cache/cache.service';
import { ArticleEntity, UserEntity } from '../../database/entities';
import { Visibility } from '../../database/migrations/dictionary';
import { TimeInSeconds } from '../../shared';
import { ArticleFindAllDto, ArticleUpdateDto, CreateArticleDto } from './dto';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(private readonly redis: CacheService) {}

  private readonly joinAuthor: Includeable[] = [
    {
      model: UserEntity,
      as: 'author',
      attributes: ['id', 'name'],
    },
  ];

  async creatArticle(dto: CreateArticleDto, userId: UserEntity['id']) {
    this.logger.log('Creating a new article');

    const article = await ArticleEntity.create({ ...dto, authorId: userId });

    return this.getArticleById(article.id, userId);
  }

  async getArticleById(id: ArticleEntity['id'], userId?: UserEntity['id']) {
    this.logger.log(`Reading article by id=${id}`);

    const cache = await this.redis.get<ArticleEntity>(redisArticleKey(id));

    if (cache) {
      if (cache?.visibility === Visibility.private && !userId) {
        throw new NotFoundException(`Article not found id=${id}`);
      }

      return cache;
    }

    const options: FindOptions = {
      where: {
        id,
        ...(userId
          ? { visibility: { [Op.in]: [Visibility.private, Visibility.public] } }
          : { visibility: Visibility.public }),
      },
      include: [...this.joinAuthor],
    };

    const task = await ArticleEntity.findOne(options);

    if (!task) {
      throw new NotFoundException('Article not found');
    }

    await this.redis.set(redisArticleKey(id), task, {
      EX: 10 * TimeInSeconds.minute,
    });

    return task.toJSON();
  }

  async updateArticle(
    id: ArticleEntity['id'],
    dto: ArticleUpdateDto,
    userId: UserEntity['id'],
  ) {
    this.logger.log(`Updating article id=${id}`);

    const article = await ArticleEntity.findOne({
      where: { id },
    });
    if (!article) {
      throw new NotFoundException('Cannot update article');
    }

    if (article.authorId !== userId) {
      throw new NotFoundException('You are not allowed to update this article');
    }

    await ArticleEntity.update(dto, { where: { id } });

    await this.redis.delete(redisArticleKey(id));

    return await this.getArticleById(id);
  }

  async delete(id: ArticleEntity['id'], userId: UserEntity['id']) {
    this.logger.log(`Deleting article by id=${id}`);

    const article = await this.getArticleById(id);

    if (article.authorId !== userId) {
      throw new NotFoundException('You are not allowed to delete this article');
    }

    await this.redis.delete(redisArticleKey(id));
    await ArticleEntity.destroy({
      where: { id: id },
    });

    return {
      success: true,
    };
  }

  async getAllArticle(query: ArticleFindAllDto, userId?: UserEntity['id']) {
    this.logger.log('Getting articles');

    const { limit, offset, sortDirection, sortBy, tags } = query;

    const cache = await this.redis.get(redisArticlesKey(query, userId));

    if (cache) {
      return cache;
    }

    const options: FindOptions = {
      offset,
      limit,
      order: [[sortBy, sortDirection]],
      include: [...this.joinAuthor],
      where: { visibility: Visibility.public },
    };

    if (userId) {
      options.where = {
        ...options.where,
        visibility: { [Op.in]: [Visibility.private, Visibility.public] },
      };
    }

    if (tags?.length) {
      options.where = {
        ...options.where,
        tags: {
          [Op.contains]: tags,
        },
      };
    }

    const { rows, count: total } = await ArticleEntity.findAndCountAll(options);

    const response = { total, limit, offset, rows };
    await this.redis.set(redisArticlesKey(query), response, {
      EX: 5 * TimeInSeconds.minute,
    });

    return response;
  }
}
