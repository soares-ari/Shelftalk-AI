// backend/src/ai/pipelines/vision-analysis.pipeline.ts

import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { AIMessage } from '@langchain/core/messages';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface para resultado da análise visual
 */
export interface VisionAnalysisResult {
  category: string;
  colors: string[];
  style: string;
  materials: string[];
  features: string[];
  detailedDescription: string;
}

/**
 * Interface para conteúdo da mensagem (pode ser string ou objeto complexo)
 */
interface MessageContent {
  text?: string;
  type?: string;
  [key: string]: unknown;
}

/**
 * VisionAnalysisPipeline
 *
 * Pipeline especializada para análise de imagens de produtos
 * usando GPT-4o-mini com capacidade de visão.
 *
 * Extrai: categoria, cores, materiais, estilo, características visuais
 */
@Injectable()
export class VisionAnalysisPipeline {
  private readonly logger = new Logger(VisionAnalysisPipeline.name);

  /**
   * Modelo com suporte a visão.
   * GPT-4o-mini suporta imagens!
   */
  private readonly visionModel = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.3, // Baixa temperatura para análise objetiva
    apiKey: process.env.OPENAI_API_KEY,
  });

  /**
   * Analisa uma imagem de produto e retorna atributos estruturados
   *
   * @param imagePath - Caminho local da imagem
   * @returns Objeto com análise estruturada da imagem
   */
  async analyzeImage(imagePath: string): Promise<VisionAnalysisResult> {
    this.logger.debug(`Analisando imagem: ${imagePath}`);

    try {
      // Converte imagem para base64
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = this.getMimeType(imagePath);

      // Prompt estruturado para análise de produto
      const analysisPrompt = `Você é um especialista em análise de produtos para e-commerce.
Analise esta imagem de produto e retorne APENAS um JSON válido (sem markdown, sem explicações) com a seguinte estrutura:

{
  "category": "categoria do produto (ex: roupa, eletrônico, acessório)",
  "colors": ["cor1", "cor2"],
  "style": "estilo visual (ex: moderno, clássico, minimalista, esportivo)",
  "materials": ["material1", "material2"],
  "features": ["característica visual 1", "característica visual 2"],
  "detailedDescription": "descrição objetiva do que você vê na imagem em 2-3 frases"
}

Seja preciso e objetivo. Use português brasileiro.`;

      // Chamada ao modelo com visão
      const response = await this.visionModel.invoke([
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: analysisPrompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ]);

      // 🔥 Parse da resposta com tipagem correta
      const responseText = this.extractTextFromResponse(response);

      // Remove markdown se houver
      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const analysis = JSON.parse(cleanedText) as VisionAnalysisResult;

      this.logger.debug(
        `Análise completa: categoria=${analysis.category}, cores=${analysis.colors.length}`,
      );

      return analysis;
    } catch (error) {
      // 🔥 Tratamento de erro com tipagem correta
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`Erro ao analisar imagem: ${errorMessage}`, errorStack);

      // Fallback: retorna análise vazia se falhar
      return {
        category: 'produto',
        colors: [],
        style: 'não identificado',
        materials: [],
        features: [],
        detailedDescription: 'Análise visual não disponível',
      };
    }
  }

  /**
  /**
   * Extrai texto da resposta do LangChain com tipagem segura
   */
  private extractTextFromResponse(response: AIMessage): string {
    const content = response.content;

    // Caso 1: content é string diretamente
    if (typeof content === 'string') {
      return content;
    }

    // Caso 2: content é array
    if (Array.isArray(content)) {
      for (const item of content) {
        if (
          typeof item === 'object' &&
          item !== null &&
          'text' in item &&
          typeof item.text === 'string'
        ) {
          return item.text;
        }
      }
    }

    // Caso 3: content é objeto (use unknown primeiro para conversão segura)
    if (typeof content === 'object' && content !== null && 'text' in content) {
      const unknownContent = content as unknown;
      const messageContent = unknownContent as MessageContent;

      if (typeof messageContent.text === 'string') {
        return messageContent.text;
      }
    }

    // Fallback: serializa como JSON
    return JSON.stringify(content);
  }

  /**
   * Determina o MIME type baseado na extensão do arquivo
   */
  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  /**
   * Formata a análise em texto natural para enriquecer prompts
   */
  formatAnalysisForPrompt(analysis: VisionAnalysisResult): string {
    const parts: string[] = [];

    if (analysis.category && analysis.category !== 'produto') {
      parts.push(`Categoria: ${analysis.category}`);
    }

    if (analysis.colors.length > 0) {
      parts.push(`Cores: ${analysis.colors.join(', ')}`);
    }

    if (analysis.style && analysis.style !== 'não identificado') {
      parts.push(`Estilo: ${analysis.style}`);
    }

    if (analysis.materials.length > 0) {
      parts.push(`Materiais: ${analysis.materials.join(', ')}`);
    }

    if (analysis.features.length > 0) {
      parts.push(`Características visuais: ${analysis.features.join('; ')}`);
    }

    if (analysis.detailedDescription) {
      parts.push(`\nDescrição visual: ${analysis.detailedDescription}`);
    }

    return parts.join('\n');
  }
}
