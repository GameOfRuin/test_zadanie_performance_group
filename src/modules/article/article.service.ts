import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FindOptions, Includeable, Op } from 'sequelize';
import { redisArticleKey, redisArticlesKey } from '../../cache/cache.keys';
import { CacheService } from '../../cache/cache.service';
import { ArticlesEntity, UserEntity } from '../../database/entities';
import { TimeInSeconds } from '../../shared';
import { ArticleFindAllDto, CreateArticleDto } from './dto';
import { ArticleUpdateDto } from './dto/article-update.dto';

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

  async creatArticle(dto: CreateArticleDto, user: UserEntity) {
    this.logger.log('Creating a new article');

    if (dto.tags && Array.isArray(dto.tags)) {
      dto.tags = dto.tags.join(',');
    }

    const newArticle = await ArticlesEntity.create({ ...dto, authorId: user.id });

    return this.getArticleById(newArticle.id, user.id);
  }

  async getArticleById(articleId: ArticlesEntity['id'], userId?: UserEntity['id']) {
    this.logger.log(`Reading article by id`);

    const cacheTask = await this.redis.get<ArticlesEntity>(redisArticleKey(articleId));

    if (cacheTask) {
      if (cacheTask?.visibility === 'private') {
        if (!userId) {
          throw new NotFoundException(`Article not found id=${articleId}`);
        }
      }
      return cacheTask;
    }
    const options: FindOptions = {
      where: { id: articleId },
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

    const task = await ArticlesEntity.findOne(options);

    if (!task) {
      throw new NotFoundException('Article not found');
    }

    await this.redis.set(redisArticleKey(articleId), task, {
      EX: 10 * TimeInSeconds.minute,
    });

    return task.toJSON();
  }

  async updateArticle(
    dto: ArticleUpdateDto,
    userId: UserEntity['id'],
    articleId: ArticlesEntity['id'],
  ) {
    this.logger.log('Updating article');

    const article = await ArticlesEntity.findOne({
      where: { id: articleId },
      raw: true,
    });
    if (!article) {
      throw new NotFoundException('Cannot update article');
    }

    if (article.authorId !== userId) {
      throw new NotFoundException('You are not allowed to update this article');
    }
    await ArticlesEntity.update(dto, {
      where: { id: articleId },
    });

    await this.redis.delete(redisArticleKey(articleId));

    return await this.getArticleById(articleId);
  }

  async delete(userId: UserEntity['id'], idArticle: ArticlesEntity['id']) {
    this.logger.log('Request to delete article');

    const article = await this.getArticleById(idArticle);

    if (article.authorId !== userId) {
      throw new NotFoundException('You are not allowed to delete this article');
    }

    await this.redis.delete(redisArticleKey(idArticle));
    await ArticlesEntity.destroy({
      where: { id: idArticle },
    });

    return {
      success: true,
    };
  }

  async getAllArticle(query: ArticleFindAllDto, id?: UserEntity['id']) {
    this.logger.log('Getting articles');

    const { limit, offset, sortDirection, sortBy, tags } = query;

    const article = await this.redis.get(redisArticlesKey(query));

    if (article) {
      if (!id) {
        return article.rows.filter((r) => r.visibility === 'public');
      }
      return article;
    }

    const options: FindOptions = {
      offset,
      limit,
      order: [[sortBy, sortDirection]],
      include: [...this.joinAuthor],
      where: { visibility: 'public' },
    };

    if (id) {
      options.where = {
        ...options.where,
        visibility: { [Op.in]: ['private', 'public'] },
      };
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
