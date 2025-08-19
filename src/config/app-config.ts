import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { config as readEnv } from 'dotenv';
import * as process from 'node:process';
import { AppConfigDto } from './dto';

readEnv();

const rawConfig = {
  port: process.env.PORT,
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
