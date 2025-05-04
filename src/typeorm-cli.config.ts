// src/typeorm-cli.config.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({ path: '.env' }); // Load .env file

// Pastikan variabel DATABASE_URL terbaca
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

// Pastikan path ke entities dan migrations benar relatif terhadap root project
// Jika file ini ada di src/, path mungkin perlu '../dist/**/*.entity.js' atau '../src/**/*.entity.ts'
// tergantung bagaimana Anda menjalankan CLI. Menggunakan path absolut lebih aman.
const entitiesPath = `${__dirname}/**/*.entity{.ts,.js}`;
const migrationsPath = `${__dirname}/../database/migrations/*{.ts,.js}`; // Sesuaikan path ini

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Perlu untuk Neon
  },
  entities: [entitiesPath], // Path ke entity files (compiled JS jika menjalankan dari dist)
  migrations: [migrationsPath], // Path ke migration files
  // Jangan gunakan synchronize: true jika menggunakan migrasi
  synchronize: false,
  logging: true, // Aktifkan logging untuk debug
  migrationsTableName: 'migrations_history', // Nama tabel untuk histori migrasi
});