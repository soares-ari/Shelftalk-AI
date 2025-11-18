// test/e2e/products.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'http';
import { AppModule } from '../../src/app.module';
import {
  createAuthenticatedUser,
  createTestProduct,
  type TestProduct,
} from '../helpers/test-helpers';

describe('ProductsController (E2E)', () => {
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

  describe('POST /products', () => {
    it('deve criar um produto com sucesso', async () => {
      const user = await createAuthenticatedUser(app);

      const response = await request(app.getHttpServer() as Server)
        .post('/products')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          name: 'Camiseta Teste E2E',
          description: 'Descrição de teste',
        })
        .expect(201);

      const body = response.body as TestProduct;

      expect(body).toHaveProperty('id');
      expect(body.name).toBe('Camiseta Teste E2E');
      expect(body.description).toBe('Descrição de teste');
      expect(body.ownerId).toBe(user.id);
    });

    it('deve criar produto sem descrição (campo opcional)', async () => {
      const user = await createAuthenticatedUser(app);

      const response = await request(app.getHttpServer() as Server)
        .post('/products')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          name: 'Produto Sem Descrição',
        })
        .expect(201);

      const body = response.body as TestProduct;
      expect(body.description).toBeNull();
    });

    it('deve rejeitar criação sem autenticação', async () => {
      await request(app.getHttpServer() as Server)
        .post('/products')
        .send({
          name: 'Produto Teste',
          description: 'Descrição',
        })
        .expect(401);
    });

    it('deve rejeitar produto sem nome', async () => {
      const user = await createAuthenticatedUser(app);

      await request(app.getHttpServer() as Server)
        .post('/products')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          description: 'Descrição sem nome',
        })
        .expect(400);
    });
  });

  describe('POST /products (with image upload)', () => {
    it('deve criar produto COM imagem via multipart/form-data', async () => {
      const user = await createAuthenticatedUser(app);

      const product = await createTestProduct(
        app,
        user.token!,
        'Tênis Nike com Imagem',
        'Produto de teste com upload',
        true,
      );

      expect(product.imageUrl).toBeDefined();
      expect(product.imageUrl).toContain(
        'http://localhost:3001/uploads/products/',
      );
      expect(product.imageUrl).toMatch(/\.(jpg|jpeg|png|webp)$/i);
    });

    it('deve criar produto SEM imagem (imageUrl = null)', async () => {
      const user = await createAuthenticatedUser(app);

      const product = await createTestProduct(
        app,
        user.token!,
        'Produto Sem Imagem',
        'Sem upload',
        false,
      );

      expect(product.imageUrl).toBeNull();
    });

    it('deve rejeitar upload de arquivo não-imagem', async () => {
      const user = await createAuthenticatedUser(app);

      const textBuffer = Buffer.from('not an image');

      const response = await request(app.getHttpServer() as Server)
        .post('/products')
        .set('Authorization', `Bearer ${user.token}`)
        .field('name', 'Produto Teste')
        .attach('image', textBuffer, 'file.txt')
        .expect(400);

      const body = response.body as { message: string | string[] };
      const message = Array.isArray(body.message)
        ? body.message.join(' ')
        : body.message;

      expect(message).toContain('Tipo de arquivo inválido');
    });
  });

  describe('GET /products', () => {
    it('deve listar produtos do usuário autenticado', async () => {
      const user = await createAuthenticatedUser(app);

      await createTestProduct(app, user.token!, 'Produto 1');
      await createTestProduct(app, user.token!, 'Produto 2');

      const response = await request(app.getHttpServer() as Server)
        .get('/products')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      const body = response.body as TestProduct[];

      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThanOrEqual(2);
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('name');
    });

    it('deve retornar array vazio para usuário sem produtos', async () => {
      const user = await createAuthenticatedUser(app);

      const response = await request(app.getHttpServer() as Server)
        .get('/products')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      const body = response.body as TestProduct[];
      expect(Array.isArray(body)).toBe(true);
    });
  });

  describe('GET /products/:id', () => {
    it('deve retornar produto específico do usuário', async () => {
      const user = await createAuthenticatedUser(app);
      const product = await createTestProduct(app, user.token!);

      const response = await request(app.getHttpServer() as Server)
        .get(`/products/${product.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      const body = response.body as TestProduct;

      expect(body.id).toBe(product.id);
      expect(body.name).toBe(product.name);
    });

    it('deve rejeitar acesso a produto de outro usuário (403)', async () => {
      const user1 = await createAuthenticatedUser(app);
      const user2 = await createAuthenticatedUser(app);

      const product = await createTestProduct(app, user1.token!);

      await request(app.getHttpServer() as Server)
        .get(`/products/${product.id}`)
        .set('Authorization', `Bearer ${user2.token}`)
        .expect(403);
    });

    it('deve retornar 404 para produto inexistente', async () => {
      const user = await createAuthenticatedUser(app);

      await request(app.getHttpServer() as Server)
        .get('/products/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404);
    });
  });

  describe('PATCH /products/:id', () => {
    it('deve atualizar nome do produto', async () => {
      const user = await createAuthenticatedUser(app);
      const product = await createTestProduct(app, user.token!);

      const response = await request(app.getHttpServer() as Server)
        .patch(`/products/${product.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({ name: 'Nome Atualizado' })
        .expect(200);

      const body = response.body as TestProduct;

      expect(body.name).toBe('Nome Atualizado');
      expect(body.description).toBe(product.description);
    });

    it('deve atualizar descrição do produto', async () => {
      const user = await createAuthenticatedUser(app);
      const product = await createTestProduct(app, user.token!);

      const response = await request(app.getHttpServer() as Server)
        .patch(`/products/${product.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({ description: 'Nova descrição' })
        .expect(200);

      const body = response.body as TestProduct;

      expect(body.description).toBe('Nova descrição');
    });
  });

  describe('DELETE /products/:id', () => {
    it('deve deletar produto com sucesso', async () => {
      const user = await createAuthenticatedUser(app);
      const product = await createTestProduct(app, user.token!);

      await request(app.getHttpServer() as Server)
        .delete(`/products/${product.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(204);

      await request(app.getHttpServer() as Server)
        .get(`/products/${product.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404);
    });
  });
});
