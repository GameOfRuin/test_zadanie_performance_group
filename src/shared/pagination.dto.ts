import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ example: 'Лимит отображение. стандарт 10' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit: number = 10;

  @ApiProperty({ example: 'Страница отображения, стандарт 0' })
  @IsNumber()
  @Type(() => Number)
  offset: number = 0;
}

export enum SortDirectionEnum {
  asc = 'asc',
  desc = 'desc',
}
