// backend/src/ai/pipelines/social-post.pipeline.ts

import { Injectable, Logger } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { SocialPostInput, GenerationResult } from './ai-pipeline.types';

/**
 * SocialPostPipeline
 *
 * Gera uma legenda / copy para redes sociais com base no produto.
 * Suporta: Instagram, TikTok, Facebook e Pinterest
 */
@Injectable()
export class SocialPostPipeline {
  private readonly logger = new Logger(SocialPostPipeline.name);

  private readonly model = new ChatOpenAI({
    modelName: 'gpt-4o-mini' satisfies string,
    temperature: 0.9, // ← ALTA criatividade para social
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Executa a pipeline
  async run(input: SocialPostInput): Promise<GenerationResult> {
    this.logger.debug(
      `Gerando post social para produto: ${input.name} no canal ${input.channel}`,
    );

    const tone = input.tone ?? 'neutro';

    // ADAPTA ESTILO POR CANAL
    let styleGuide = '';
    switch (input.channel) {
      case 'instagram':
        styleGuide =
          'Formato Instagram: visual, use emojis estrategicamente, inclua 3-5 hashtags relevantes ao final. Tom aspiracional e inspirador.';
        break;
      case 'tiktok':
        styleGuide =
          'Formato TikTok: dinâmico, jovem, descontraído. Call-to-action forte. Use linguagem atual e referências de trends quando aplicável.';
        break;
      case 'facebook':
        styleGuide =
          'Formato Facebook: conversacional, storytelling, foque em engajamento. Público mais amplo (25-55 anos). Texto pode ser mais longo e detalhado.';
        break;
      case 'pinterest':
        styleGuide =
          'Formato Pinterest: descritivo e focado em inspiração e descoberta. Destaque usos, benefícios visuais e ideias de aplicação do produto.';
        break;
      default:
        styleGuide = 'Tom neutro e profissional.';
    }

    // PROMPT TEMPLATE usando LangChain
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system', // ← Instrução do sistema (define comportamento)
        [
          'Você é um social media especializado em criar legendas para e-commerce em português do Brasil.',
          'Adapte o texto para o canal e público-alvo específico.',
          `Use um tom coerente com a marca: ${tone}.`,
          styleGuide,
          'Você pode usar emojis com moderação estratégica.',
        ].join(' '),
      ],
      [
        'human', // ← Input do usuário
        [
          'Canal: {channel}',
          'Nome do produto: {name}',
          'Descrição base (se houver): {description}',
          '',
          'Crie uma legenda envolvente que incentive o clique, compartilhamento ou compra.',
        ].join('\n'),
      ],
    ]);

    // CHAIN = Prompt + Model (padrão LangChain)
    const chain = prompt.pipe(this.model);

    // EXECUÇÃO
    const response = await chain.invoke({
      channel: input.channel,
      name: input.name,
      description: input.description ?? '',
      tone,
    });

    // PARSE da resposta
    const text =
      typeof response === 'string' ? response : (response.content as string);

    return {
      text,
    };
  }
}
