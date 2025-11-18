// backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // Logs úteis para debug do ambiente de desenvolvimento
  console.log('\n🔍 ===== ENVIRONMENT CHECK =====');
  console.log('   POSTGRES_HOST:', process.env.POSTGRES_HOST);
  console.log('   POSTGRES_PORT:', process.env.POSTGRES_PORT);
  console.log('   POSTGRES_USER:', process.env.POSTGRES_USER);
  console.log('   POSTGRES_DB:', process.env.POSTGRES_DB);
  console.log(
    '   POSTGRES_PASSWORD:',
    process.env.POSTGRES_PASSWORD ? '***' : 'MISSING',
  );
  console.log('   PORT:', process.env.PORT);
  console.log('================================\n');

  // Cria a aplicação NestJS com suporte a Express completo
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Habilita validação global usando class-validator e DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove qualquer campo não declarado no DTO
      forbidNonWhitelisted: true, // rejeita requisições com propriedades extras
      transform: true, // transforma payloads para instâncias de DTO
    }),
  );

  // Servir arquivos estáticos (imagens de produtos)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Habilita CORS
  app.enableCors();

  // Define porta com fallback para 3000
  const port = process.env.PORT ?? 3000;
  console.log(`🚀 Tentando subir na porta: ${port}\n`);

  await app.listen(port);

  console.log(`\n✅ Application is running on: http://localhost:${port}`);
  console.log(
    `📝 Swagger docs (se configurado): http://localhost:${port}/api/docs`,
  );
  console.log(`📁 Static files: http://localhost:${port}/uploads/\n`);
}

// Tratamento de erros na inicialização
bootstrap().catch((error: Error) => {
  console.error('\n❌ ===== ERRO AO INICIAR =====');
  console.error('Mensagem:', error.message);
  console.error('Stack:', error.stack);
  console.error('================================\n');
  process.exit(1);
});
