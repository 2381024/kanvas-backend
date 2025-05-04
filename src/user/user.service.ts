import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByUsername(username: string): Promise<User | undefined> {
    // findOne untuk username mungkin juga mengembalikan User | null,
    // periksa apakah perlu diubah juga jika error serupa muncul di sini.
    // Atau, jika Anda ingin tetap undefined di sini, tangani null secara eksplisit:
    const user = await this.usersRepository.findOne({ where: { username } });
    return user === null ? undefined : user;
  }

  // --- Perubahan di sini ---
  async findOneById(id: string): Promise<User | null> { // <-- Ubah undefined menjadi null
    // Sekarang user akan bertipe User | null, sesuai promise fungsi
    const user = await this.usersRepository.findOne({ where: { id } });

    // Logika Anda saat ini melempar error jika user null, ini tidak masalah.
    // Signature fungsi hanya mendefinisikan apa tipe KEMUNGKINAN return value jika fungsi
    // selesai secara normal (tanpa throw).
    if (!user) { // atau bisa juga if (user === null)
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    // Jika sampai sini, 'user' bertipe 'User'. Tipe 'User' cocok dengan 'User | null'.
    return user;
  }
}