import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { entityProviders, SEQUELIZE, sequelizeProvider } from './sequelize.providers';

@Global()
@Module({
  providers: [sequelizeProvider, ...entityProviders],
  exports: [sequelizeProvider, ...entityProviders],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Gracefully Shutdown
   */
  async onApplicationShutdown() {
    await this.sequelize.close();
  }
}
