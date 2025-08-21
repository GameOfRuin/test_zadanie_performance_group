import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { UserEntity } from '../../database/entities';
import { User } from '../../decorators';
import { IdNumberDto } from '../../shared';
import { ArticleService } from './article.service';
import {
  ArticleFindAllDto,
  ArticleResponseDto,
  ArticleUpdateDto,
  CreateArticleDto,
} from './dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { OptionalJwtGuard } from '../../guards/jwt.optionalguard';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiCreatedResponse({
    description: 'Возвращает созданную статью',
    type: ArticleResponseDto,
  })
  @ApiOperation({ summary: 'Создание новой статьи' })
  @Post('create')
  async creatArticle(@Body() dto: CreateArticleDto, @User() user: UserEntity) {
    return this.articleService.creatArticle(dto, user.id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Статья найдена',
    type: ArticleResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Article not found' })
  @UseGuards(OptionalJwtGuard)
  @Get('/:id')
  async getArticleById(
    @Param() { id }: IdNumberDto,
    @User() user: UserEntity | undefined,
  ) {
    return await this.articleService.getArticleById(id, user?.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '🗑 Удаление статьи' })
  @ApiOkResponse({ description: 'Статья успешно удалена' })
  @ApiForbiddenResponse({ description: 'Нет прав на удаление статьи' })
  @Delete('/:id')
  async delete(@Param() { id }: IdNumberDto, @User() user: UserEntity) {
    return this.articleService.delete(id, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiCreatedResponse({ type: ArticleResponseDto })
  @ApiOperation({ summary: 'Изменение статьи' })
  @ApiOkResponse({
    description: 'Возвращает обновлённую статью',
    type: ArticleResponseDto,
  })
  @Put('/:id')
  async updateArticle(
    @Param() { id }: IdNumberDto,
    @Body() dto: ArticleUpdateDto,
    @User() user: UserEntity,
  ) {
    return await this.articleService.updateArticle(id, dto, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(OptionalJwtGuard)
  @ApiOkResponse({
    description: 'Список статей',
    type: ArticleResponseDto,
  })
  @ApiOperation({ summary: 'Поиск всех статей' })
  @Get('/')
  async getAllArticle(@Req() request: FastifyRequest, @Query() query: ArticleFindAllDto) {
    const userId = request.user?.id;
    return await this.articleService.getAllArticle(query, userId);
  }
}
