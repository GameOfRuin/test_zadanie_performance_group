import { Module } from '@nestjs/common';
import { DatabaseModule } from './database';
import { UserModule } from './users/users.module';

@Module({
  imports: [UserModule, DatabaseModule],
})
export class AppModule {}
