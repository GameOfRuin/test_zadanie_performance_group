import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { JwtGuard } from '../../guards/jwt.guard';
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
}
