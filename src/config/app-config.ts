import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { config as readEnv } from 'dotenv';
import * as process from 'node:process';
import { AppConfigDto } from './dto';

readEnv();

type EnvStructure<T = unknown> = {
  [Key in keyof T]: T[Key] extends object ? EnvStructure<T[Key]> : string | undefined;
};

const rawConfig: EnvStructure = {
  port: process.env.PORT,
  redisUrl: process.env.REDIS_URL,
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
};

export const appConfig = plainToInstance(AppConfigDto, rawConfig);
const errors = validateSync(appConfig);

if (errors.length) {
  const [{ constraints }] = errors;

  if (constraints) {
    throw new BadRequestException(constraints[Object.keys(constraints)[0]]);
  }
  throw new BadRequestException('Unknown validate error');
}
