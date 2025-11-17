// backend/src/ai/ai.service.ts

import { Injectable, Logger } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import { LongDescriptionPipeline } from './pipelines/long-description.pipeline';
import { TitlePipeline } from './pipelines/title.pipeline';
import { TagsPipeline } from './pipelines/tags.pipeline';
import { SocialPostPipeline } from './pipelines/social-post.pipeline';
import type {
  BaseProductInput,
  TitleInput,
  TagsInput,
  SocialPostInput,
} from './pipelines/ai-pipeline.types';

/**
 * AiService
 *
 * Camada de orquestração que expõe métodos de alto nível
 * para o resto da aplicação (controllers, etc.).
 * Cada método delega para uma pipeline especializada.
 */
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly longDescriptionPipeline: LongDescriptionPipeline,
    private readonly titlePipeline: TitlePipeline,
    private readonly tagsPipeline: TagsPipeline,
    private readonly socialPostPipeline: SocialPostPipeline,
  ) {}

  /**
   * Gera uma descrição longa "preview" (sem salvar em banco).
   */
  async previewLongDescription(user: AuthUser, input: BaseProductInput) {
    this.logger.debug(`User ${user.id} solicitou preview de descrição longa`);

    const result = await this.longDescriptionPipeline.run(input);

    return {
      ownerId: user.id,
      prompt: input,
      result: result.text,
    };
  }

  /**
   * Gera um título SEO "preview".
   */
  async previewTitle(user: AuthUser, input: TitleInput) {
    this.logger.debug(`User ${user.id} solicitou preview de título SEO`);

    const result = await this.titlePipeline.run(input);

    return {
      ownerId: user.id,
      prompt: input,
      result: result.text,
    };
  }

  /**
   * Gera tags / keywords "preview".
   */
  async previewTags(user: AuthUser, input: TagsInput) {
    this.logger.debug(`User ${user.id} solicitou preview de tags`);

    const result = await this.tagsPipeline.run(input);

    return {
      ownerId: user.id,
      prompt: input,
      result: result.text,
    };
  }

  /**
   * Gera um post social "preview".
   */
  async previewSocialPost(user: AuthUser, input: SocialPostInput) {
    this.logger.debug(`User ${user.id} solicitou preview de post social`);

    const result = await this.socialPostPipeline.run(input);

    return {
      ownerId: user.id,
      prompt: input,
      result: result.text,
    };
  }
}
