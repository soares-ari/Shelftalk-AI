// backend/src/ai/pipelines/ai-pipeline.types.ts

/**
 * Tipos base usados pelas pipelines de IA.
 * Isso facilita reaproveitar os mesmos contratos em vários lugares.
 */

/**
 * Representa um produto básico, vindo do frontend ou de outra parte da API,
 * usado como contexto para geração de conteúdo.
 */
export interface BaseProductInput {
  name: string;
  description?: string;
}

/**
 * Resultado genérico de uma geração de conteúdo.
 * Em alguns casos será só `text`, em outros poderemos ter metadados.
 */
export interface GenerationResult {
  text: string;
  tokensEstimated?: number;
}

/**
 * Entrada para geração de título SEO.
 */
export interface TitleInput extends BaseProductInput {
  maxLength?: number; // limite opcional de caracteres
  marketplace?: 'mercado_livre' | 'amazon' | 'shopee' | 'generic';
}

/**
 * Entrada para geração de tags/palavras-chave.
 */
export interface TagsInput extends BaseProductInput {
  maxTags?: number;
}

/**
 * Canais possíveis para posts sociais.
 */
export type SocialChannel = 'instagram' | 'tiktok' | 'threads' | 'linkedin';

/**
 * Entrada para geração de post social.
 */
export interface SocialPostInput extends BaseProductInput {
  channel: 'instagram' | 'tiktok' | 'facebook' | 'pinterest';
  tone?: 'casual' | 'premium' | 'jovem' | 'neutro';
}
