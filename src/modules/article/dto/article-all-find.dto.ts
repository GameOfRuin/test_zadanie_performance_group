import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto, SortDirectionEnum } from '../../../shared/pagination.dto';

export enum ArticleSortByEnum {
  id = 'id',
  title = 'title',
  description = 'description',
  article = 'article',
}

export class ArticleAllFindDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Поле, по которому производится сортировка статей',
    enum: ArticleSortByEnum,
    example: ArticleSortByEnum.id,
  })
  @IsEnum(ArticleSortByEnum)
  @IsOptional()
  sortBy: ArticleSortByEnum = ArticleSortByEnum.id;

  @ApiPropertyOptional({
    description: 'Направление сортировки: по возрастанию или убыванию',
    enum: SortDirectionEnum,
    example: SortDirectionEnum.asc,
  })
  @IsEnum(SortDirectionEnum)
  @IsOptional()
  sortDirection: SortDirectionEnum = SortDirectionEnum.asc;

  @ApiPropertyOptional({
    description: 'Ключевые слова для фильтрации статей по тегам',
    type: String,
    example: 'nestjs, redis',
  })
  @IsString()
  @IsOptional()
  tags?: string;
}
