import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { JwtGuard } from '../../guards/jwt.guard';
import { IdNumberDto } from '../../shared';
import { ArticleService } from './article.service';
import { ArticleResponseDto, CreateArticleDto } from './dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiCreatedResponse({ type: ArticleResponseDto })
  @ApiOperation({ summary: 'Создание новой статьи' })
  @Post('create')
  async creatArticle(@Body() dto: CreateArticleDto, @Req() request: FastifyRequest) {
    return this.articleService.creatArticle(dto, request.user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Поиск задачи по id' })
  @Get('/:id')
  async getArticle(@Param() { id }: IdNumberDto) {
    return await this.articleService.getArticleById(id);
  }
}
