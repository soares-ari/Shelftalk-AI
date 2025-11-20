// test/helpers/test-helpers.ts

import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'http';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Interface para representar um usuário de teste
 */
export interface TestUser {
  email: string;
  password: string;
  id?: string;
  token?: string;
}

/**
 * Interface para representar um produto de teste
 */
export interface TestProduct {
  id: string;
  name: string;
  description: string | null;
  imageUrl?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface para representar uma geração de teste
 */
export interface TestGeneration {
  id: string;
  title: string;
  longDescription: string;
  tags: string;
  socialInstagram: string;
  socialTikTok: string;
  socialFacebook: string;
  socialPinterest: string;
  createdAt: string;
}

/**
 * Interface para response de registro
 */
interface RegisterResponse {
  id: string;
  email: string;
}

/**
 * Interface para response de login
 */
interface LoginResponse {
  accessToken: string;
}

/**
 * Gera um email único para testes
 */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `test-${timestamp}-${random}@shelftalk-test.com`;
}

/**
 * Registra um novo usuário de teste
 */
export async function registerTestUser(
  app: INestApplication,
  email?: string,
  password: string = 'senha123teste',
): Promise<TestUser> {
  const userEmail = email || generateTestEmail();

  const response = await request(app.getHttpServer() as Server)
    .post('/auth/register')
    .send({ email: userEmail, password })
    .expect(201);

  const body = response.body as RegisterResponse;

  return {
    email: userEmail,
    password,
    id: body.id,
  };
}

/**
 * Faz login e retorna o token JWT
 */
export async function loginTestUser(
  app: INestApplication,
  email: string,
  password: string,
): Promise<string> {
  const response = await request(app.getHttpServer() as Server)
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  const body = response.body as LoginResponse;

  expect(body.accessToken).toBeDefined();
  return body.accessToken;
}

/**
 * Cria um usuário completo (registrado + logado)
 */
export async function createAuthenticatedUser(
  app: INestApplication,
): Promise<TestUser> {
  const user = await registerTestUser(app);
  const token = await loginTestUser(app, user.email, user.password);

  return {
    ...user,
    token,
  };
}

/**
 * Cria um produto de teste (com ou sem imagem)
 */
export async function createTestProduct(
  app: INestApplication,
  token: string,
  name?: string,
  description?: string,
  withImage: boolean = false,
): Promise<TestProduct> {
  const productName = name || `Produto Teste ${Date.now()}`;
  const productDescription = description || 'Descrição de teste para validação';

  if (withImage) {
    // Upload com imagem usando multipart/form-data
    const testImagePath = path.join(__dirname, '../fixtures/test-product.jpg');

    // Verifica se imagem de teste existe, senão usa um buffer fake
    let imageBuffer: Buffer;
    if (fs.existsSync(testImagePath)) {
      imageBuffer = fs.readFileSync(testImagePath);
    } else {
      // Cria um buffer fake mínimo (1x1 pixel JPEG)
      imageBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xd9,
      ]);
    }

    const response = await request(app.getHttpServer() as Server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', productName)
      .field('description', productDescription)
      .attach('image', imageBuffer, 'test-product.jpg')
      .expect(201);

    return response.body as TestProduct;
  } else {
    // Upload sem imagem (JSON)
    const response = await request(app.getHttpServer() as Server)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: productName,
        description: productDescription,
      })
      .expect(201);

    return response.body as TestProduct;
  }
}

/**
 * Helper para aguardar um tempo (útil para rate limits)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Valida estrutura de uma geração completa
 */
export function expectValidGeneration(generation: TestGeneration): void {
  expect(generation).toBeDefined();
  expect(generation.id).toBeDefined();
  expect(generation.title).toBeDefined();
  expect(generation.longDescription).toBeDefined();
  expect(generation.tags).toBeDefined();

  // Valida os 4 campos sociais
  expect(generation.socialInstagram).toBeDefined();
  expect(generation.socialTikTok).toBeDefined();
  expect(generation.socialFacebook).toBeDefined();
  expect(generation.socialPinterest).toBeDefined();

  expect(generation.createdAt).toBeDefined();

  // Validações de conteúdo
  expect(typeof generation.title).toBe('string');
  expect(generation.title.length).toBeGreaterThan(10);
  expect(generation.longDescription.length).toBeGreaterThan(50);
  expect(generation.tags.length).toBeGreaterThan(5);

  // Valida conteúdo dos 4 canais sociais
  expect(generation.socialInstagram.length).toBeGreaterThan(20);
  expect(generation.socialTikTok.length).toBeGreaterThan(20);
  expect(generation.socialFacebook.length).toBeGreaterThan(20);
  expect(generation.socialPinterest.length).toBeGreaterThan(20);
}
