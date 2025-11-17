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

  // ========================================
  // MÉTODOS PÚBLICOS PARA CONTROLLERS
  // (Com AuthUser para logs/auditoria)
  // ========================================

  /**
   * Gera uma descrição longa "preview" (sem salvar em banco).
   * Usado pelo AiController para testes rápidos.
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

  // ========================================
  // MÉTODOS INTERNOS PARA OUTROS SERVICES
  // (Sem AuthUser - usado pelo GenerationsService)
  // ========================================

  /**
   * 🔥 NOVO: Gera título direto (sem AuthUser).
   * Usado pelo GenerationsService para salvar no banco.
   *
   * @param name - Nome do produto
   * @param description - Descrição base (opcional)
   * @param maxLength - Limite de caracteres (padrão: 80)
   * @returns string - Título gerado
   */
  async generateTitle(
    name: string,
    description?: string | null,
    maxLength: number = 80,
  ): Promise<string> {
    this.logger.debug(`Gerando título para produto: ${name}`);

    const result = await this.titlePipeline.run({
      name,
      description: description ?? undefined,
      maxLength,
    });

    return result.text;
  }

  /**
   * 🔥 NOVO: Gera descrição longa direto.
   *
   * @param name - Nome do produto
   * @param description - Descrição base (opcional)
   * @returns string - Descrição gerada
   */
  async generateLongDescription(
    name: string,
    description?: string | null,
  ): Promise<string> {
    this.logger.debug(`Gerando descrição longa para produto: ${name}`);

    const result = await this.longDescriptionPipeline.run({
      name,
      description: description ?? undefined,
    });

    return result.text;
  }

  /**
   * 🔥 NOVO: Gera tags direto.
   *
   * @param name - Nome do produto
   * @param description - Descrição base (opcional)
   * @param maxTags - Número máximo de tags (padrão: 10)
   * @returns string - Tags separadas por vírgula
   */
  async generateTags(
    name: string,
    description?: string | null,
    maxTags: number = 10,
  ): Promise<string> {
    this.logger.debug(`Gerando tags para produto: ${name}`);

    const result = await this.tagsPipeline.run({
      name,
      description: description ?? undefined,
      maxTags,
    });

    return result.text;
  }

  /**
   * 🔥 NOVO: Gera post social direto.
   *
   * @param name - Nome do produto
   * @param description - Descrição base (opcional)
   * @param channel - Canal social (instagram, tiktok, etc)
   * @param tone - Tom do texto (opcional)
   * @returns string - Post gerado
   */
  async generateSocial(
    name: string,
    description?: string | null,
    channel: 'instagram' | 'tiktok' | 'threads' | 'linkedin' = 'instagram',
    tone?: 'casual' | 'premium' | 'jovem' | 'neutro',
  ): Promise<string> {
    this.logger.debug(
      `Gerando post social para produto: ${name} no canal ${channel}`,
    );

    const result = await this.socialPostPipeline.run({
      name,
      description: description ?? undefined,
      channel,
      tone,
    });

    return result.text;
  }
}
