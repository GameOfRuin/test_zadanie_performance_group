import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @ApiProperty({ description: 'Название статьи не больше 100 символов' })
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @ApiProperty({ description: 'Описание статьи не более 250 символов' })
  @MaxLength(250)
  @IsOptional()
  description?: string;

  @IsString()
  @ApiProperty({ description: 'Описание статьи не более 250 символов' })
  @MaxLength(250)
  @IsOptional()
  tags?: string;

  @IsString()
  @ApiProperty({ description: 'Статья не менее 100 символов и не более 3333 символов' })
  @MinLength(100)
  @MaxLength(3333)
  article: string;
}
