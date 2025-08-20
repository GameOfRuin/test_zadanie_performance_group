import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Visibility } from '../../../database/migrations/dictionary';

export class ArticleUpdateDto {
  @IsString()
  @ApiProperty({ description: 'Название статьи не больше 100 символов' })
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  title: string;

  @IsString()
  @ApiProperty({ description: 'Описание статьи не более 250 символов' })
  @MaxLength(250)
  @IsOptional()
  description?: string;

  @IsString()
  @ApiProperty({ description: 'Описание статьи не более 250 символов' })
  @MaxLength(50)
  @IsOptional()
  tags?: string;

  @IsEnum(Visibility)
  @ApiProperty({ description: 'Приват не приват статья' })
  @IsOptional()
  visibility?: string;

  @IsString()
  @ApiProperty({ description: 'Статья не менее 100 символов и не более 3333 символов' })
  @MinLength(100)
  @MaxLength(3333)
  @IsOptional()
  article: string;
}
