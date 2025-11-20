// test/setup-e2e.ts

import * as dotenv from 'dotenv';
import * as path from 'path';

// Carrega o .env da raiz do backend
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Configuração global para testes E2E.
 * Executa antes de todos os testes.
 */

// Aumenta timeout para operações com IA (OpenAI pode demorar)
jest.setTimeout(30000);

// Mock de console para testes mais limpos (opcional)
global.console = {
  ...console,
  log: jest.fn(), // Silencia logs durante testes
  debug: jest.fn(),
  info: jest.fn(),
  // Mantém warn e error para debug
  warn: console.warn,
  error: console.error,
};

// Configuração de variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET =
  process.env.JWT_SECRET || 'test-jwt-secret-key-super-secure';
process.env.POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
process.env.POSTGRES_PORT = process.env.POSTGRES_PORT || '5432';
process.env.POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
process.env.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
process.env.POSTGRES_DB = 'shelftalk'; //  Usar banco dev
process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
process.env.REDIS_PORT = process.env.REDIS_PORT || '6379';

// Valida que OPENAI_API_KEY existe
if (!process.env.OPENAI_API_KEY) {
  console.warn(
    '⚠️  OPENAI_API_KEY não configurada. Testes de geração vão falhar.',
  );
}
