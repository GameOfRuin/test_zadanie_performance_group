import { Module } from '@nestjs/common';
import { DatabaseModule } from './database';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [UserModule, DatabaseModule],
})
export class AppModule {}
