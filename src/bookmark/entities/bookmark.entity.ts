// src/bookmark/entities/bookmark.entity.ts
import { Portfolio } from '../../portfolio/entities/portfolio.entity';
import { User } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  Column,
} from 'typeorm';

// Menjamin kombinasi user dan portfolio unik
@Unique(['userId', 'portfolioId'])
@Entity('bookmarks')
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relasi: Banyak Bookmark dimiliki oleh satu User
  @ManyToOne(() => User, (user) => user.bookmarks, { eager: false, onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  // Relasi: Banyak Bookmark merujuk ke satu Portfolio
  @ManyToOne(() => Portfolio, (portfolio) => portfolio.bookmarkedBy, { eager: false, onDelete: 'CASCADE' })
  portfolio: Portfolio;

  @Column()
  portfolioId: string;
}