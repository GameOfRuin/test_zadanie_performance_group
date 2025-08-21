import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Visibility } from '../../../database/migrations/dictionary';

export class ArticleUpdateDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Название статьи (3–100 символов)',
    example: 'Черные дыры: новые открытия',
  })
  title?: string;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Краткое описание статьи (до 250 символов)',
    example: 'Обзор последних исследований и наблюдений за черными дырами.',
  })
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10) // например, ограничим до 10 тегов
  @IsString({ each: true }) // проверяем, что каждый элемент массива — строка
  @ApiPropertyOptional({
    description: 'Теги статьи в виде массива строк (например, ["астрономия", "космос"])',
    example: ['астрономия', 'космос', 'черные дыры'],
    type: [String],
  })
  tags?: string[];

  @IsEnum(Visibility)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Приватная или публичная статья',
    example: Visibility.public,
  })
  visibility?: Visibility;

  @IsString()
  @MinLength(100)
  @MaxLength(3333)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Полный текст статьи (100–3333 символа)',
    example:
      'В этой статье рассматриваются новые открытия в области черных дыр, их свойства и влияние на окружающее пространство. Приводятся примеры наблюдений и исследований последних лет.',
  })
  text?: string;
}
