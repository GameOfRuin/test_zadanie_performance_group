import { Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database';
import { ArticleModule } from './modules/article/article.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [UserModule, DatabaseModule, CacheModule, ArticleModule],
})
export class AppModule {}
