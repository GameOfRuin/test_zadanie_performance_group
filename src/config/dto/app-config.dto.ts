import { plainToInstance, Transform, Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { PostgresConfigDto } from './postgres-config.dto';

export class AppConfigDto {
  @IsNumber()
  @Type(() => Number)
  port: number;

  @ValidateNested()
  @Transform(({ value }) => plainToInstance(PostgresConfigDto, value))
  postgres: PostgresConfigDto;
}
