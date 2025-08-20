import { Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [UserModule, DatabaseModule, CacheModule],
})
export class AppModule {}
