// src/portfolio/entities/portfolio.entity.ts
import { Bookmark } from '../../bookmark/entities/bookmark.entity';
import { User } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('portfolios')
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true }) // URL gambar bisa opsional
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relasi: Banyak Portfolio dimiliki oleh satu User
  @ManyToOne(() => User, (user) => user.portfolios, { eager: false }) // eager: false agar tidak otomatis load user
  user: User;

  @Column() // Simpan user ID untuk memudahkan query
  userId: string;

  // Relasi: Satu Portfolio bisa di-bookmark oleh banyak User (melalui tabel Bookmark)
  @OneToMany(() => Bookmark, (bookmark) => bookmark.portfolio)
  bookmarkedBy: Bookmark[];
}