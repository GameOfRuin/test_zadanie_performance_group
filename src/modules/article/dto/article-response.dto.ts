import { ApiProperty } from '@nestjs/swagger';
import { UserIncludeDto } from '../../users/dto';

export class ArticleResponseDto {
  @ApiProperty({ example: 8 })
  id: number;

  @ApiProperty({ example: 'Черный дыры ВСЁ!!!!!!!!' })
  title: string;

  @ApiProperty({ example: 'Самые новые данные по черным дырам ТАААМ ТАКОЕ' })
  description: string;

  @ApiProperty({ example: '' })
  tags: string;

  @ApiProperty({ example: 'Очень большая статья' })
  article: string;

  @ApiProperty({ example: 1 })
  authorId: number;

  @ApiProperty({ example: '2025-06-17T13:07:37.788Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-06-17T14:25:46.443Z' })
  updatedAt: string;

  @ApiProperty({ type: UserIncludeDto })
  author: UserIncludeDto;
}
