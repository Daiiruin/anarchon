import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './features/auth/auth.module';
import { CasesModule } from './features/cases/cases.module';
import { validateEnv } from './config/env.validation';
import { buildDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: buildDatabaseConfig,
    }),
    // Local dev only: serves anarchon-backend/media/ at /media, so MEDIA_BASE_URL
    // can point to a real folder without standing up an object storage server yet.
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'media'),
      serveRoot: '/media',
    }),
    AuthModule,
    CasesModule,
  ],
})
export class AppModule {}
