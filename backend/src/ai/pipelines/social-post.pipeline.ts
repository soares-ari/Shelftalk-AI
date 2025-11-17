// backend/src/ai/pipelines/social-post.pipeline.ts

import { Injectable, Logger } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { SocialPostInput, GenerationResult } from './ai-pipeline.types';

/**
 * SocialPostPipeline
 *
 * Gera uma legenda / copy para redes sociais com base no produto.
 */
@Injectable()
export class SocialPostPipeline {
  private readonly logger = new Logger(SocialPostPipeline.name);

  private readonly model = new ChatOpenAI({
    modelName: 'gpt-4o-mini' satisfies string,
    temperature: 0.9,
    apiKey: process.env.OPENAI_API_KEY,
  });

  async run(input: SocialPostInput): Promise<GenerationResult> {
    this.logger.debug(
      `Gerando post social para produto: ${input.name} no canal ${input.channel}`,
    );

    const tone = input.tone ?? 'neutro';

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        [
          'Você é um social media que cria legendas para redes sociais em português do Brasil.',
          'Adapte o texto para o canal informado (ex: Instagram, TikTok, etc.).',
          'Use um tom coerente com a marca: {tone}.',
          'Você pode usar emojis com moderação, mas evite exageros.',
        ].join(' '),
      ],
      [
        'human',
        [
          'Canal: {channel}',
          'Nome do produto: {name}',
          'Descrição base (se houver): {description}',
          '',
          'Crie uma legenda envolvente que incentive o clique ou a compra.',
        ].join('\n'),
      ],
    ]);

    const chain = prompt.pipe(this.model);

    const response = await chain.invoke({
      channel: input.channel,
      name: input.name,
      description: input.description ?? '',
      tone,
    });

    const text =
      typeof response === 'string' ? response : (response.content as string);

    return {
      text,
    };
  }
}
