import { Global, Module } from '@nestjs/common';
import { CacheService } from '../../cache/cache.servise';
import { JwtService } from '../jwt/jwt.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Global()
@Module({
  controllers: [ArticleController],
  providers: [ArticleService, JwtService, CacheService],
})
export class ArticleModule {}
