// test/e2e/generations.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest'; // 🔥 sem asterisco
import type { Server } from 'http'; // 🔥 import do tipo Server
import { AppModule } from '../../src/app.module';
import {
  createAuthenticatedUser,
  createTestProduct,
  expectValidGeneration,
  sleep,
  type TestGeneration, // 🔥 import da interface
} from '../helpers/test-helpers';

describe('GenerationsController (E2E) - FLUXO PRINCIPAL', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /generations/generate-all', () => {
    it('🔥 deve gerar conteúdo completo para um produto (TESTE PRINCIPAL)', async () => {
      // Arrange: Cria usuário e produto
      const user = await createAuthenticatedUser(app);
      const product = await createTestProduct(
        app,
        user.token!,
        'Camiseta Oversized Preta Premium',
        '100% algodão egípcio, modelagem ampla, estilo streetwear, unissex',
      );

      console.log(`\n🧪 Testando geração para produto: ${product.name}`);
      console.log('⏳ Aguarde... (pode levar 3-5 segundos)\n');

      // Act: Gera conteúdo
      const startTime = Date.now();
      const response = await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: product.id })
        .expect(201);

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      const body = response.body as TestGeneration; // 🔥 type assertion

      // Assert: Valida estrutura da resposta
      expectValidGeneration(body);

      // Assert: Valida conteúdo específico
      expect(body.title).toContain('Camiseta');
      expect(body.longDescription.toLowerCase()).toContain('algodão');
      expect(body.tags.toLowerCase()).toContain('camiseta');

      // Log dos resultados (útil para debug)
      console.log(`✅ Geração completa em ${duration}s\n`);
      console.log('📊 RESULTADOS:');
      console.log(`   Título (${body.title.length} chars):`);
      console.log(`   "${body.title}"\n`);
      console.log(`   Descrição (${body.longDescription.length} chars):`);
      console.log(`   "${body.longDescription.substring(0, 150)}..."\n`);
      console.log(`   Tags: ${body.tags}\n`);
      console.log(`   Social (${body.socialText.length} chars):`);
      console.log(`   "${body.socialText.substring(0, 100)}..."\n`);
    }, 30000); // Timeout de 30s para operações com IA

    it('deve gerar conteúdo diferente para produtos diferentes', async () => {
      const user = await createAuthenticatedUser(app);

      // Cria 2 produtos bem diferentes
      const product1 = await createTestProduct(
        app,
        user.token!,
        'Notebook Gamer',
        'Intel i7, RTX 3060, 16GB RAM',
      );

      await sleep(2000); // Aguarda 2s entre gerações (rate limit)

      const product2 = await createTestProduct(
        app,
        user.token!,
        'Livro de Ficção',
        'Romance fantástico, 300 páginas',
      );

      // Gera conteúdo para ambos
      const gen1 = await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: product1.id })
        .expect(201);

      await sleep(2000);

      const gen2 = await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: product2.id })
        .expect(201);

      const body1 = gen1.body as TestGeneration; // 🔥 type assertion
      const body2 = gen2.body as TestGeneration; // 🔥 type assertion

      // Valida que são diferentes
      expect(body1.title).not.toBe(body2.title);
      expect(body1.longDescription).not.toBe(body2.longDescription);

      // Valida conteúdo contextual
      expect(body1.title.toLowerCase()).toContain('notebook');
      expect(body2.title.toLowerCase()).toContain('livro');
    }, 60000); // Timeout maior para múltiplas gerações

    it('deve rejeitar geração para produto inexistente (404)', async () => {
      const user = await createAuthenticatedUser(app);

      await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: '00000000-0000-0000-0000-000000000000' })
        .expect(404);
    });

    it('deve rejeitar geração para produto de outro usuário (404)', async () => {
      const user1 = await createAuthenticatedUser(app);
      const user2 = await createAuthenticatedUser(app);

      const product = await createTestProduct(app, user1.token!);

      await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .set('Authorization', `Bearer ${user2.token}`)
        .send({ productId: product.id })
        .expect(404);
    });

    it('deve rejeitar geração sem autenticação (401)', async () => {
      await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .send({ productId: '123' })
        .expect(401);
    });
  });

  describe('GET /generations/product/:id', () => {
    it('deve listar todas as gerações de um produto', async () => {
      const user = await createAuthenticatedUser(app);
      const product = await createTestProduct(app, user.token!);

      // Gera conteúdo 2 vezes
      await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: product.id })
        .expect(201);

      await sleep(2000);

      await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: product.id })
        .expect(201);

      // Busca gerações
      const response = await request(app.getHttpServer() as Server)
        .get(`/generations/product/${product.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      const body = response.body as TestGeneration[]; // 🔥 type assertion

      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(2);

      // Valida ordem (mais recente primeiro)
      const dates = body.map((g) => new Date(g.createdAt)); // 🔥 tipado agora
      expect(dates[0] >= dates[1]).toBe(true);
    }, 60000);

    it('deve retornar array vazio para produto sem gerações', async () => {
      const user = await createAuthenticatedUser(app);
      const product = await createTestProduct(app, user.token!);

      const response = await request(app.getHttpServer() as Server)
        .get(`/generations/product/${product.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('Validação de Qualidade do Conteúdo', () => {
    it('deve gerar título com tamanho apropriado (20-100 chars)', async () => {
      const user = await createAuthenticatedUser(app);
      const product = await createTestProduct(app, user.token!);

      const response = await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: product.id })
        .expect(201);

      const body = response.body as TestGeneration;

      expect(body.title.length).toBeGreaterThanOrEqual(20);
      expect(body.title.length).toBeLessThanOrEqual(100);
    }, 30000);

    it('deve gerar descrição longa com mínimo de 100 caracteres', async () => {
      const user = await createAuthenticatedUser(app);
      const product = await createTestProduct(app, user.token!);

      const response = await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: product.id })
        .expect(201);

      const body = response.body as TestGeneration;

      expect(body.longDescription.length).toBeGreaterThanOrEqual(100);
    }, 30000);

    it('deve gerar tags separadas por vírgula', async () => {
      const user = await createAuthenticatedUser(app);
      const product = await createTestProduct(app, user.token!);

      const response = await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: product.id })
        .expect(201);

      const body = response.body as TestGeneration;

      expect(body.tags).toContain(',');
      const tagsArray = body.tags.split(',');
      expect(tagsArray.length).toBeGreaterThanOrEqual(3);
    }, 30000);
  });
});
