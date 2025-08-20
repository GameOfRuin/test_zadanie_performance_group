import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class IdNumberDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: 'Уникальный идентификатор сущности',
    example: 4,
  })
  id: number;
}
