import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { User } from '../user/entities/user.entity';
import { PortfolioService } from '../portfolio/portfolio.service'; // Untuk cek portfolio

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
    private portfolioService: PortfolioService, // Inject portfolio service
  ) {}

  async addBookmark(portfolioId: string, user: User): Promise<Bookmark> {
    // 1. Cek apakah portfolio ada
    const portfolio = await this.portfolioService.findOne(portfolioId); // findOne akan throw NotFoundException jika tidak ada

    // 2. Cek apakah sudah di-bookmark sebelumnya
    const existingBookmark = await this.bookmarksRepository.findOne({
        where: { portfolioId: portfolio.id, userId: user.id },
    });
    if (existingBookmark) {
        throw new ConflictException('Portfolio ini sudah Anda bookmark');
    }

    // 3. Buat bookmark baru
    const bookmark = this.bookmarksRepository.create({
      user: user,
      userId: user.id,
      portfolio: portfolio,
      portfolioId: portfolio.id,
    });

    return this.bookmarksRepository.save(bookmark);
  }

  async removeBookmark(portfolioId: string, user: User): Promise<void> {
    // Cari bookmark berdasarkan portfolioId dan userId
    const result = await this.bookmarksRepository.delete({
      portfolioId: portfolioId,
      userId: user.id,
    });

    // Jika tidak ada row yang terhapus, berarti bookmark tidak ditemukan
    if (result.affected === 0) {
      throw new NotFoundException(`Bookmark untuk portfolio ID "${portfolioId}" tidak ditemukan`);
    }
  }

  async findUserBookmarks(user: User): Promise<Bookmark[]> {
    // Ambil semua bookmark milik user, dan load data portfolionya
    return this.bookmarksRepository.find({
      where: { userId: user.id },
      relations: ['portfolio', 'portfolio.user'], // Load portfolio dan user pembuat portfolio
    });
  }
}