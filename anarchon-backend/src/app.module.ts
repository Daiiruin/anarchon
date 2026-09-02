import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    AuthModule,
    CasesModule,
  ],
})
export class AppModule {}
