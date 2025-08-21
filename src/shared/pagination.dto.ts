import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Лимит отображаемых элементов на странице. По умолчанию 10',
    example: 10,
  })
  limit: number = 10;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Смещение для пагинации (страница). По умолчанию 0',
    example: 0,
  })
  offset: number = 0;
}

export enum SortDirectionEnum {
  asc = 'asc',
  desc = 'desc',
}
