import { ApiProperty } from '@nestjs/swagger';
import { UserIncludeDto } from '../../users/dto';

export class ArticleResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор статьи',
    example: 8,
  })
  id: number;

  @ApiProperty({
    description: 'Заголовок статьи',
    example: 'Черные дыры: последние открытия и исследования',
  })
  title: string;

  @ApiProperty({
    description: 'Краткое описание статьи',
    example: 'Статья о самых свежих данных по черным дырам и космическим событиям.',
  })
  description: string;

  @ApiProperty({
    description: 'Список тегов статьи через запятую',
    example: 'астрономия, космос, черные дыры',
  })
  tags: string;

  @ApiProperty({
    description: 'Полный текст статьи',
    example:
      'В этой статье рассматриваются новые открытия в области черных дыр, их свойства и влияние на окружающее пространство. Приводятся примеры наблюдений и исследований последних лет.',
  })
  article: string;

  @ApiProperty({
    description: 'Идентификатор автора статьи',
    example: 1,
  })
  authorId: number;

  @ApiProperty({
    description: 'Дата и время создания статьи',
    example: '2025-06-17T13:07:37.788Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Дата и время последнего обновления статьи',
    example: '2025-06-17T14:25:46.443Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Данные автора статьи',
    type: UserIncludeDto,
  })
  author: UserIncludeDto;
}
