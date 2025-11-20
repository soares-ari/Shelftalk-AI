// backend/src/ai/ai.service.ts

import { Injectable, Logger } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import { LongDescriptionPipeline } from './pipelines/long-description.pipeline';
import { TitlePipeline } from './pipelines/title.pipeline';
import { TagsPipeline } from './pipelines/tags.pipeline';
import { SocialPostPipeline } from './pipelines/social-post.pipeline';
import { VisionAnalysisPipeline } from './pipelines/vision-analysis.pipeline';
import type {
  BaseProductInput,
  TitleInput,
  TagsInput,
  SocialPostInput,
} from './pipelines/ai-pipeline.types';
import * as path from 'path';

/**
 * AiService
 *
 * Camada de orquestração que expõe métodos de alto nível
 * para o resto da aplicação (controllers, services).
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
    private readonly visionPipeline: VisionAnalysisPipeline,
  ) {}

  // MÉTODO PRIVADO: Enriquece descrição com análise visual
  private async enrichWithVisionAnalysis(
    description: string | null | undefined,
    imageUrl: string | null | undefined,
  ): Promise<string> {
    let enrichedDescription = description || '';

    if (imageUrl) {
      try {
        const imagePath = path.join(process.cwd(), imageUrl);
        this.logger.debug(`Analisando imagem: ${imagePath}`);
        // 1. ANALISA IMAGEM
        const visionAnalysis =
          await this.visionPipeline.analyzeImage(imagePath);

        // 2. FORMATA EM TEXTO
        const visionContext =
          this.visionPipeline.formatAnalysisForPrompt(visionAnalysis);

        // 3. ADICIONA AO CONTEXTO
        enrichedDescription = `${description || ''}\n\nAnálise visual:\n${visionContext}`;
        this.logger.debug('Contexto enriquecido com análise visual');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Erro desconhecido';
        // Continua sem visão se falhar
        this.logger.warn(
          `Falha ao analisar imagem, continuando sem visão: ${errorMessage}`,
        );
      }
    }

    return enrichedDescription;
  }

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
   * Gera título direto (sem AuthUser).
   * Usado pelo GenerationsService para salvar no banco.
   * Suporta análise de imagem se imageUrl fornecida.
   */
  async generateTitle(
    name: string,
    description?: string | null,
    maxLength: number = 80,
    imageUrl?: string | null,
  ): Promise<string> {
    this.logger.debug(`Gerando título para produto: ${name}`);

    // 1. ENRIQUECE COM VISÃO (se tem imagem)
    const enrichedDescription = await this.enrichWithVisionAnalysis(
      description,
      imageUrl,
    );
    // 2. CHAMA PIPELINE DE TÍTULO
    const result = await this.titlePipeline.run({
      name,
      description: enrichedDescription,
      maxLength,
    });

    return result.text;
  }

  /**
   * Gera descrição longa.
   * Suporta análise de imagem se imageUrl fornecida.
   */
  async generateLongDescription(
    name: string,
    description?: string | null,
    imageUrl?: string | null,
  ): Promise<string> {
    this.logger.debug(`Gerando descrição longa para produto: ${name}`);

    const enrichedDescription = await this.enrichWithVisionAnalysis(
      description,
      imageUrl,
    );

    const result = await this.longDescriptionPipeline.run({
      name,
      description: enrichedDescription,
    });

    return result.text;
  }

  /**
   * Gera tags separadas por vírgula.
   * Suporta análise de imagem se imageUrl fornecida.
   */
  async generateTags(
    name: string,
    description?: string | null,
    imageUrl?: string | null,
    maxTags: number = 10,
  ): Promise<string> {
    this.logger.debug(`Gerando tags para produto: ${name}`);

    const enrichedDescription = await this.enrichWithVisionAnalysis(
      description,
      imageUrl,
    );

    const result = await this.tagsPipeline.run({
      name,
      description: enrichedDescription,
      maxTags,
    });

    return result.text;
  }

  /**
   * Gera post para redes sociais.
   * Suporta análise de imagem se imageUrl fornecida.
   */
  async generateSocial(
    name: string,
    description?: string | null,
    channel: 'instagram' | 'tiktok' | 'facebook' | 'pinterest' = 'instagram',
    imageUrl?: string | null,
    tone?: 'casual' | 'premium' | 'jovem' | 'neutro',
  ): Promise<string> {
    this.logger.debug(
      `Gerando post social para produto: ${name} no canal ${channel}`,
    );

    const enrichedDescription = await this.enrichWithVisionAnalysis(
      description,
      imageUrl,
    );

    const result = await this.socialPostPipeline.run({
      name,
      description: enrichedDescription,
      channel,
      tone,
    });

    return result.text;
  }
}
