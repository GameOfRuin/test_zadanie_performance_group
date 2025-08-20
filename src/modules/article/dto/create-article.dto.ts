import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Visibility } from '../../../database/migrations/dictionary';

export class CreateArticleDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({
    description: 'Название статьи (3–100 символов)',
    example: 'Черные дыры: новые открытия',
  })
  title: string;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Краткое описание статьи (до 250 символов)',
    example: 'Обзор последних исследований и наблюдений за черными дырами.',
  })
  description?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Теги статьи через запятую (до 50 символов)',
    example: 'астрономия, космос, черные дыры',
  })
  tags?: string;

  @IsEnum(Visibility)
  @ApiProperty({
    description: 'Приватная или публичная статья',
    example: 'public',
  })
  visibility: Visibility;

  @IsString()
  @MinLength(100)
  @MaxLength(3333)
  @ApiProperty({
    description: 'Полный текст статьи (100–3333 символа)',
    example:
      'В этой статье рассматриваются новые открытия в области черных дыр, их свойства и влияние на окружающее пространство. Приводятся примеры наблюдений и исследований последних лет.',
  })
  article: string;
}
