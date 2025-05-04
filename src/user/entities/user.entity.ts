// src/user/entities/user.entity.ts
import { Bookmark } from '../../bookmark/entities/bookmark.entity';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  Index,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users') // Nama tabel di database
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true }) // Username harus unik
  @Column({ length: 50 })
  username: string;

  @Column()
  password_hash: string; // Simpan hash password, bukan password asli

  // Relasi: Satu User bisa punya banyak Portfolio
  @OneToMany(() => Portfolio, (portfolio) => portfolio.user)
  portfolios: Portfolio[];

  // Relasi: Satu User bisa punya banyak Bookmark
  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  // Hook untuk hash password sebelum disimpan
  @BeforeInsert()
  async hashPassword() {
    if (this.password_hash) {
      const saltRounds = 10; // Tingkat kompleksitas hashing
      this.password_hash = await bcrypt.hash(this.password_hash, saltRounds);
    }
  }

  // Method helper untuk validasi password (digunakan di auth.service)
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
}