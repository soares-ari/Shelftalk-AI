import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

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
      useFactory: (configService: ConfigService) => {
        const db = configService.get<PostgresConfig>('postgres');

        if (!db) {
          throw new Error('PostgreSQL configuration not found.');
        }

        return {
          type: 'postgres' as const,
          host: db.host,
          port: db.port,
          username: db.user,
          password: db.password,
          database: db.db,
          autoLoadEntities: true,
          synchronize: true, // ⚠ permitido somente em dev
        };
      },
    }),
  ],
})
export class DatabaseModule {}
