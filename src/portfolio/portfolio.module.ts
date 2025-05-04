// src/portfolio/portfolio.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { AuthModule } from '../auth/auth.module'; // Impor AuthModule jika perlu proteksi

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio]),
    AuthModule, // Untuk menggunakan JwtAuthGuard
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService]
})
export class PortfolioModule {}