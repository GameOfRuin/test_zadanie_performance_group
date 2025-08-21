import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Visibility } from '../../../database/migrations/dictionary';

export class CreateArticleDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
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
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: String,
    isArray: true,
    description: 'Теги статьи',
    example: ['астрономия', 'космос', 'черные', 'дыры'],
  })
  tags?: string[];

  @IsOptional()
  @IsEnum(Visibility)
  @ApiPropertyOptional({
    description: 'Приватная или публичная статья',
    enum: Visibility,
    example: Visibility.public,
  })
  visibility?: Visibility;

  @IsString()
  @IsOptional()
  @MinLength(100)
  @MaxLength(3333)
  @ApiPropertyOptional({
    description: 'Полный текст статьи (100–3333 символа)',
    example:
      'В этой статье рассматриваются новые открытия в области черных дыр, их свойства и влияние на окружающее пространство. Приводятся примеры наблюдений и исследований последних лет.',
  })
  text?: string;
}
