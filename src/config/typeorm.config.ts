import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isTest = process.env.NODE_ENV === 'test';
    const isProd = process.env.NODE_ENV === 'production';

    if (isProd) {
      // ✅ Postgres for production
      return {
        type: 'postgres',
        host: this.configService.get<string>('DB_HOST'),
        port: this.configService.get<number>('DB_PORT'),
        username: this.configService.get<string>('DB_USER'),
        password: this.configService.get<string>('DB_PASS'),
        database: this.configService.get<string>('DB_NAME'),
        synchronize: false, // never auto-sync in production
        migrationsRun: true, // run migrations automatically
        autoLoadEntities: true,
      };
    }

    // ✅ SQLite for development & test
    return {
      type: 'sqlite',
      database: this.configService.get<string>('DB_NAME'),
      synchronize: isTest, // auto-sync in test
      migrationsRun: isTest,
      autoLoadEntities: true,
    };
  }
}
