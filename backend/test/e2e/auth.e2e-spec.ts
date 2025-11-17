// test/e2e/auth.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest'; // 🔥 Mudança 1: sem asterisco
import type { Server } from 'http'; // 🔥 Mudança 2: import do tipo Server
import { AppModule } from '../../src/app.module';
import { generateTestEmail } from '../helpers/test-helpers';

// 🔥 Mudança 3: Interfaces para responses
interface RegisterResponse {
  id: string;
  email: string;
}

interface LoginResponse {
  accessToken: string;
}

interface UserMeResponse {
  id: string;
  email: string;
}

describe('AuthController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Aplica mesma configuração do main.ts
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

  describe('POST /auth/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const email = generateTestEmail();

      const response = await request(app.getHttpServer() as Server) // 🔥 as Server
        .post('/auth/register')
        .send({
          email,
          password: 'senha123',
        })
        .expect(201);

      const body = response.body as RegisterResponse; // 🔥 type assertion

      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('email');
      expect(body.email).toBe(email);
      expect(body).not.toHaveProperty('password');
      expect(body).not.toHaveProperty('passwordHash');
    });

    it('deve rejeitar email duplicado (409 Conflict)', async () => {
      const email = generateTestEmail();

      // Primeiro registro
      await request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send({ email, password: 'senha123' })
        .expect(201);

      // Segundo registro (deve falhar)
      const response = await request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send({ email, password: 'senha123' })
        .expect(409);

      const body = response.body as { message: string };
      expect(body.message).toContain('already registered');
    });

    it('deve rejeitar email inválido (400 Bad Request)', async () => {
      await request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send({
          email: 'email-invalido',
          password: 'senha123',
        })
        .expect(400);
    });

    it('deve rejeitar senha muito curta (400 Bad Request)', async () => {
      await request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send({
          email: generateTestEmail(),
          password: '123', // Menos de 6 caracteres
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const email = generateTestEmail();
      const password = 'senha123';

      // Registra usuário
      await request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send({ email, password })
        .expect(201);

      // Faz login
      const response = await request(app.getHttpServer() as Server)
        .post('/auth/login')
        .send({ email, password })
        .expect(200);

      const body = response.body as LoginResponse;

      expect(body).toHaveProperty('accessToken');
      expect(typeof body.accessToken).toBe('string');
      expect(body.accessToken.length).toBeGreaterThan(20);
    });

    it('deve rejeitar credenciais inválidas (401 Unauthorized)', async () => {
      const email = generateTestEmail();

      // Registra usuário
      await request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send({ email, password: 'senha123' })
        .expect(201);

      // Tenta login com senha errada
      await request(app.getHttpServer() as Server)
        .post('/auth/login')
        .send({ email, password: 'senhaErrada' })
        .expect(401);
    });

    it('deve rejeitar usuário inexistente (401 Unauthorized)', async () => {
      await request(app.getHttpServer() as Server)
        .post('/auth/login')
        .send({
          email: 'naoexiste@teste.com',
          password: 'senha123',
        })
        .expect(401);
    });
  });

  describe('JWT Token Validation', () => {
    it('deve permitir acesso a rota protegida com token válido', async () => {
      const email = generateTestEmail();
      const password = 'senha123';

      // Registra e faz login
      await request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send({ email, password })
        .expect(201);

      const loginResponse = await request(app.getHttpServer() as Server)
        .post('/auth/login')
        .send({ email, password })
        .expect(200);

      const loginBody = loginResponse.body as LoginResponse;
      const token = loginBody.accessToken;

      // Testa rota protegida
      const response = await request(app.getHttpServer() as Server)
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const body = response.body as UserMeResponse;

      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('email');
      expect(body.email).toBe(email);
    });

    it('deve rejeitar acesso sem token (401 Unauthorized)', async () => {
      await request(app.getHttpServer() as Server)
        .get('/users/me')
        .expect(401);
    });

    it('deve rejeitar token inválido (401 Unauthorized)', async () => {
      await request(app.getHttpServer() as Server)
        .get('/users/me')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);
    });
  });
});
