import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(
    '🔍 ENV CHECK → POSTGRES_PASSWORD =',
    process.env.POSTGRES_PASSWORD,
  );
  console.log('🔍 ENV CHECK → POSTGRES_HOST =', process.env.POSTGRES_HOST);
  console.log('🔍 ENV CHECK → PORT =', process.env.PORT);

  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 3000;
  console.log('🚀 Tentando subir na porta:', port);

  await app.listen(port);

  console.log(`✅ Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('❌ ERRO AO INICIAR:', error);
  process.exit(1);
});
