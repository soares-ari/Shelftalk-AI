// src/ai/ai.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { GenerateDescriptionDto } from './dto/generate-description.dto';

/**
 * Estrutura interna usada pelo serviço de IA.
 * Separar esse tipo ajuda a manter o código organizado.
 */
interface GenerateDescriptionInput {
  name: string;
  description?: string;
}

/**
 * AiService
 *
 * Camada de orquestração de prompts + modelos LLM usando LangChain.
 * Ele NÃO sabe nada de HTTP ou Nest controllers — é puro domínio.
 */
@Injectable()
export class AiService {
  /**
   * Instância do modelo de chat da OpenAI via LangChain.
   * Aqui escolhemos o modelo, temperatura, etc.
   */
  private readonly model: ChatOpenAI;

  constructor() {
    // Garante que a chave de API esteja presente em runtime
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        'OPENAI_API_KEY não definida. Configure no .env do backend.',
      );
    }

    this.model = new ChatOpenAI({
      // Modelo leve, bom para geração de texto com custo menor
      model: 'gpt-4.1-mini',
      temperature: 0.7,
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Converte o DTO HTTP em um objeto interno da camada de domínio.
   * Isso desacopla a borda (controller) do core (serviço).
   */
  mapDtoToInput(dto: GenerateDescriptionDto): GenerateDescriptionInput {
    return {
      name: dto.name,
      description: dto.description,
    };
  }

  /**
   * Gera uma descrição de produto persuasiva em PT-BR,
   * usando um "prompt pipeline" com LangChain:
   *
   * ChatPromptTemplate -> ChatOpenAI -> StringOutputParser
   */
  async generateProductDescription(
    input: GenerateDescriptionInput,
  ): Promise<string> {
    try {
      // 1. Definimos o "prompt de sistema" + "prompt do usuário"
      const prompt = ChatPromptTemplate.fromMessages([
        [
          'system',
          [
            'Você é um assistente especializado em copywriting para e-commerce.',
            'Escreva em português do Brasil, com foco em conversão, clareza e escaneabilidade.',
            'Evite promessas exageradas e mantenha o tom profissional.',
          ].join(' '),
        ],
        [
          'human',
          [
            'Nome do produto: {name}',
            'Descrição inicial / contexto adicional: {description}',
            '',
            'Tarefas:',
            '- Escreva uma descrição persuasiva de até 3 parágrafos curtos;',
            '- Destaque benefícios concretos e diferenciais;',
            '- Use linguagem simples e direta;',
            '- Não repita o nome do produto em todas as frases.',
          ].join('\n'),
        ],
      ]);

      // 2. Encadeamos: Prompt -> Modelo -> Parser de string
      const chain = prompt.pipe(this.model).pipe(new StringOutputParser());

      // 3. Executamos o chain com as variáveis do prompt
      const description = await chain.invoke({
        name: input.name,
        description: input.description ?? '',
      });

      return description;
    } catch (error) {
      // Aqui você pode logar o erro em algum serviço de observabilidade no futuro
      // Por enquanto, convertemos para um erro HTTP 500 amigável.
      throw new InternalServerErrorException(
        'Falha ao gerar descrição com IA. Tente novamente em instantes.',
      );
    }
  }
}
