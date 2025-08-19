import { Provider } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { Model, Sequelize } from 'sequelize-typescript';
import { appConfig } from '../config';
import * as entities from './entities';

export const SEQUELIZE = 'SEQUELIZE';

export const sequelizeProvider: Provider<Sequelize> = {
  provide: SEQUELIZE,
  useFactory: async (): Promise<Sequelize> => {
    const sequelize: Sequelize = new Sequelize({
      ...appConfig.postgres,
      dialect: 'postgres',
      logging: false,
    });

    sequelize.addModels(Object.values(entities));

    await sequelize.authenticate();

    return sequelize;
  },
};

export const entityProviders = Object.values(entities).map(
  (entity: ClassConstructor<Model>) => ({
    provide: entity.name,
    useValue: entity,
  }),
);
