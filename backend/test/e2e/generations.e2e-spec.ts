// test/e2e/generations.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'http';
import { AppModule } from '../../src/app.module';
import {
  createAuthenticatedUser,
  createTestProduct,
  expectValidGeneration,
  sleep,
  type TestGeneration,
} from '../helpers/test-helpers';

describe('GenerationsController (E2E)', () => {
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
    it('deve gerar conteúdo completo para produto SEM imagem', async () => {
      const user = await createAuthenticatedUser(app);
      const product = await createTestProduct(
        app,
        user.token!,
        'Camiseta Oversized Preta Premium',
        '100% algodão egípcio, modelagem ampla, estilo streetwear, unissex',
        false,
      );

      console.log(`\nTestando geração SEM imagem para: ${product.name}`);
      console.log('Aguarde... (10-15 segundos)\n');

      const startTime = Date.now();
      const response = await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: product.id })
        .expect(201);

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      const body = response.body as TestGeneration;

      expectValidGeneration(body);

      expect(body.title).toContain('Camiseta');
      expect(body.longDescription.toLowerCase()).toContain('algodão');
      expect(body.tags.toLowerCase()).toContain('camiseta');

      expect(body.socialInstagram).toBeDefined();
      expect(body.socialTikTok).toBeDefined();
      expect(body.socialFacebook).toBeDefined();
      expect(body.socialPinterest).toBeDefined();

      console.log(`Geração completa em ${duration}s\n`);
      console.log('RESULTADOS:');
      console.log(`Título (${body.title.length} chars): "${body.title}"`);
      console.log(`Instagram: ${body.socialInstagram.length} chars`);
      console.log(`TikTok: ${body.socialTikTok.length} chars`);
      console.log(`Facebook: ${body.socialFacebook.length} chars`);
      console.log(`Pinterest: ${body.socialPinterest.length} chars\n`);
    }, 30000);

    it('deve gerar conteúdo COM análise de imagem (Vision AI)', async () => {
      const user = await createAuthenticatedUser(app);
      const product = await createTestProduct(
        app,
        user.token!,
        'Tênis Esportivo',
        'Confortável para corridas',
        true,
      );

      console.log('\nTestando geração COM Vision AI');
      console.log('Aguarde... (15-20s devido à análise de imagem)\n');

      const startTime = Date.now();
      const response = await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: product.id })
        .expect(201);

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      const body = response.body as TestGeneration;

      expectValidGeneration(body);

      expect(product.imageUrl).toBeDefined();
      expect(product.imageUrl).not.toBeNull();

      console.log(`Vision AI processou imagem em ${duration}s`);
      console.log(`ImageUrl: ${product.imageUrl}\n`);
    }, 40000);

    it('deve gerar conteúdo diferente para produtos diferentes', async () => {
      const user = await createAuthenticatedUser(app);

      const product1 = await createTestProduct(
        app,
        user.token!,
        'Notebook Gamer',
        'Intel i7, RTX 3060, 16GB RAM',
      );

      await sleep(2000);

      const product2 = await createTestProduct(
        app,
        user.token!,
        'Livro de Ficção',
        'Romance fantástico, 300 páginas',
      );

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

      const body1 = gen1.body as TestGeneration;
      const body2 = gen2.body as TestGeneration;

      expect(body1.title).not.toBe(body2.title);
      expect(body1.longDescription).not.toBe(body2.longDescription);

      expect(body1.title.toLowerCase()).toContain('notebook');
      expect(body2.title.toLowerCase()).toContain('livro');
    }, 60000);

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

      const response = await request(app.getHttpServer() as Server)
        .get(`/generations/product/${product.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      const body = response.body as TestGeneration[];

      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(2);

      const dates = body.map((g) => new Date(g.createdAt));
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

    it('deve gerar conteúdo único para cada canal social', async () => {
      const user = await createAuthenticatedUser(app);
      const product = await createTestProduct(app, user.token!);

      const response = await request(app.getHttpServer() as Server)
        .post('/generations/generate-all')
        .set('Authorization', `Bearer ${user.token}`)
        .send({ productId: product.id })
        .expect(201);

      const body = response.body as TestGeneration;

      expect(body.socialInstagram).not.toBe(body.socialTikTok);
      expect(body.socialInstagram).not.toBe(body.socialFacebook);
      expect(body.socialInstagram).not.toBe(body.socialPinterest);
      expect(body.socialTikTok).not.toBe(body.socialFacebook);
    }, 30000);
  });
});
