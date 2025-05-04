// src/portfolio/portfolio.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { User } from '../user/entities/user.entity'; // Import User

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfoliosRepository: Repository<Portfolio>,
  ) {}

  async create(createPortfolioDto: CreatePortfolioDto, user: User): Promise<Portfolio> {
    const portfolio = this.portfoliosRepository.create({
      ...createPortfolioDto,
      user: user, // Kaitkan dengan user yang login
      userId: user.id,
    });
    return this.portfoliosRepository.save(portfolio);
  }

  async findAll(): Promise<Portfolio[]> {
    // Anda mungkin ingin menambahkan paginasi di sini
    // Dan mungkin juga load relasi user jika perlu
    return this.portfoliosRepository.find({ relations: ['user'] }); // Contoh load user
  }

  async findOne(id: string): Promise<Portfolio> {
    const portfolio = await this.portfoliosRepository.findOne({
        where: { id },
        relations: ['user'], // Load user yang membuat
    });
    if (!portfolio) {
      throw new NotFoundException(`Portfolio dengan ID "${id}" tidak ditemukan`);
    }
    return portfolio;
  }

  async update(id: string, updatePortfolioDto: UpdatePortfolioDto, user: User): Promise<Portfolio> {
    const portfolio = await this.findOne(id); // Cek apakah portfolio ada

    // Cek kepemilikan
    if (portfolio.userId !== user.id) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengedit portfolio ini');
    }

    // Gabungkan data lama dengan data baru
    const updatedPortfolio = Object.assign(portfolio, updatePortfolioDto);

    return this.portfoliosRepository.save(updatedPortfolio);
  }

  async remove(id: string, user: User): Promise<void> {
    const portfolio = await this.findOne(id); // Cek apakah portfolio ada

    // Cek kepemilikan
    if (portfolio.userId !== user.id) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus portfolio ini');
    }

    const result = await this.portfoliosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Portfolio dengan ID "${id}" tidak ditemukan`);
    }
  }

  // Tambahan: Cari portfolio milik user tertentu
  async findByUser(userId: string): Promise<Portfolio[]> {
    return this.portfoliosRepository.find({ where: { userId }});
  }
}