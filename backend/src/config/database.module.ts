import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

// ✅ Importação explícita das entities
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

/**
 * Interface descrevendo a configuração
 * que lemos do arquivo .env via ConfigService.
 */
interface PostgresConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  db: string;
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      /**
       * A função que constrói a configuração TypeORM
       * usando valores do .env via ConfigService.
       */
      useFactory: (configService: ConfigService) => {
        const db = configService.get<PostgresConfig>('postgres');

        if (!db) {
          throw new Error('PostgreSQL configuration not found.');
        }

        // 🔍 Log para debug - mostra as credenciais carregadas
        console.log('🔧 Database Config Loaded:');
        console.log('   Host:', db.host);
        console.log('   Port:', db.port);
        console.log('   User:', db.user);
        console.log('   Database:', db.db);
        console.log('   Password:', db.password ? '***' : 'MISSING');

        return {
          type: 'postgres' as const,
          host: db.host,
          port: db.port,
          username: db.user,
          password: db.password,
          database: db.db,

          /**
           * ✅ ENTITIES EXPLÍCITAS
           * Muito mais seguro que glob patterns.
           * Adicione novas entities aqui conforme criar.
           */
          entities: [User, Product],

          /**
           * ⚠️ Em ambiente DEV o synchronize=true é aceitável.
           * Em produção, sempre desligar e usar migrations.
           */
          synchronize: true,

          /**
           * 📝 Logs SQL habilitados para debug.
           * Desative em produção.
           */
          logging: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
