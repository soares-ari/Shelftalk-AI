// backend/src/ai/ai.controller.ts

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { GenerateDescriptionDto } from './dto/generate-description.dto';
import { GenerateTitleDto } from './dto/generate-title.dto';
import { GenerateTagsDto } from './dto/generate-tags.dto';
import { GenerateSocialPostDto } from './dto/generate-social-post.dto';

/**
 * AiController
 *
 * Expõe endpoints HTTP para consumir as pipelines de IA.
 * Todas as rotas são protegidas por JWT.
 */
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * Preview de descrição longa de produto.
   * Rota: POST /ai/preview/description
   */
  @Post('preview/description')
  previewDescription(
    @CurrentUser() user: AuthUser,
    @Body() dto: GenerateDescriptionDto,
  ) {
    return this.aiService.previewLongDescription(user, {
      name: dto.name,
      description: dto.description,
    });
  }

  /**
   * Preview de título SEO.
   * Rota: POST /ai/preview/title
   */
  @Post('preview/title')
  previewTitle(@CurrentUser() user: AuthUser, @Body() dto: GenerateTitleDto) {
    return this.aiService.previewTitle(user, {
      name: dto.name,
      description: dto.description,
      maxLength: dto.maxLength,
      marketplace: dto.marketplace,
    });
  }

  /**
   * Preview de tags / keywords.
   * Rota: POST /ai/preview/tags
   */
  @Post('preview/tags')
  previewTags(@CurrentUser() user: AuthUser, @Body() dto: GenerateTagsDto) {
    return this.aiService.previewTags(user, {
      name: dto.name,
      description: dto.description,
      maxTags: dto.maxTags,
    });
  }

  /**
   * Preview de post social.
   * Rota: POST /ai/preview/social
   */
  @Post('preview/social')
  previewSocial(
    @CurrentUser() user: AuthUser,
    @Body() dto: GenerateSocialPostDto,
  ) {
    return this.aiService.previewSocialPost(user, {
      name: dto.name,
      description: dto.description,
      channel: dto.channel,
      tone: dto.tone,
    });
  }
}
