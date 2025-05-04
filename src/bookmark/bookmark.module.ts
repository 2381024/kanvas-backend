// src/bookmark/bookmark.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { PortfolioModule } from '../portfolio/portfolio.module'; // Mungkin diperlukan
import { AuthModule } from '../auth/auth.module'; // Untuk proteksi

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark]),
    PortfolioModule, // Jika service bookmark perlu akses portfolio service/repo
    AuthModule, // Untuk menggunakan JwtAuthGuard
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}