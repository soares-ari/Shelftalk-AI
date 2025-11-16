import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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

  // Cria a aplicação NestJS com logs verbosos
  const app = await NestFactory.create(AppModule, {
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

  // Define porta com fallback para 3000
  const port = process.env.PORT ?? 3000;
  console.log(`🚀 Tentando subir na porta: ${port}\n`);

  await app.listen(port);

  console.log(`\n✅ Application is running on: http://localhost:${port}`);
  console.log(
    `📝 Swagger docs (se configurado): http://localhost:${port}/api/docs\n`,
  );
}

// Tratamento de erros na inicialização
bootstrap().catch((error) => {
  console.error('\n❌ ===== ERRO AO INICIAR =====');
  console.error('Mensagem:', error.message);
  console.error('Stack:', error.stack);
  console.error('================================\n');
  process.exit(1);
});
