import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto, SortDirectionEnum } from '../../../shared/pagination.dto';

export enum ArticleSortByEnum {
  id = 'id',
  title = 'title',
  description = 'description',
  article = 'article',
}

export class ArticleAllFindDto extends PaginationDto {
  @ApiProperty({ example: 'Где осуществляется поиск например description' })
  @IsEnum(ArticleSortByEnum)
  @IsOptional()
  sortBy: ArticleSortByEnum = ArticleSortByEnum.id;

  @ApiProperty({ example: 'На убывание или на возрастание' })
  @IsEnum(SortDirectionEnum)
  @IsOptional()
  sortDirection: SortDirectionEnum = SortDirectionEnum.asc;

  @ApiProperty({ example: 'Ключевое слово для поиска' })
  @IsString()
  @IsOptional()
  tags?: string;
}
