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
import { JwtGuard, OptinolJwtGuard } from '../../guards/jwt.guard';
import { IdNumberDto } from '../../shared';
import { ArticleService } from './article.service';
import { ArticleAllFindDto, ArticleResponseDto, CreateArticleDto } from './dto';
import { ArticleUpdateDto } from './dto/article-update.dto';

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
  async creatArticle(@Body() dto: CreateArticleDto, @Req() request: FastifyRequest) {
    return this.articleService.creatArticle(dto, request.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Статья найдена',
    type: ArticleResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Статья не найдена' })
  @UseGuards(OptinolJwtGuard)
  @Get('/:id')
  async getArticleById(@Param() { id }: IdNumberDto, @Req() request: FastifyRequest) {
    const userId = request.user?.id;
    return await this.articleService.getArticleById(id, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '🗑 Удаление статьи' })
  @ApiOkResponse({ description: 'Статья успешно удалена' })
  @ApiForbiddenResponse({ description: 'Нет прав на удаление статьи' })
  @Delete('/:id')
  async delete(@Req() request: FastifyRequest, @Param() { id }: IdNumberDto) {
    return this.articleService.delete(request.user.id, id);
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
    @Body() dto: ArticleUpdateDto,
    @Req() request: FastifyRequest,
    @Param() { id }: IdNumberDto,
  ) {
    return await this.articleService.updateArticle(dto, request.user.id, id);
  }

  @ApiBearerAuth()
  @UseGuards(OptinolJwtGuard)
  @ApiOkResponse({
    description: 'Список статей',
    type: ArticleResponseDto,
  })
  @ApiOperation({ summary: 'Поиск всех статей' })
  @Get('/')
  async getAllArticle(@Req() request: FastifyRequest, @Query() query: ArticleAllFindDto) {
    const userId = request.user?.id;
    return await this.articleService.getAllArticle(query, userId);
  }
}
