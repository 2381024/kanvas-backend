// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { User } from './user/entities/user.entity';
import { Portfolio } from './portfolio/entities/portfolio.entity';
import { Bookmark } from './bookmark/entities/bookmark.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Membuat ConfigModule tersedia global
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Portfolio, Bookmark],
        synchronize: false, // false karena kita akan menggunakan migrasi
        ssl: {
          rejectUnauthorized: false, // Diperlukan untuk koneksi ke Neon/Heroku/dll
        },
        autoLoadEntities: true, // Alternatif: daftarkan entities di sini atau di module masing-masing
      }),
    }),
    AuthModule,
    UserModule,
    PortfolioModule,
    BookmarkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}