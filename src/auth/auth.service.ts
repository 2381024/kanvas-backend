import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User) // Inject repository User untuk registrasi
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user && (await user.validatePassword(pass))) {
      const { password_hash, ...result } = user; // Jangan kembalikan hash password
      return result;
    }
    return null;
  }

  async login(user: any) {
    // user didapat dari hasil validate LocalStrategy
    const payload = { username: user.username, sub: user.id }; // 'sub' biasanya ID user
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { username, password } = registerUserDto;

    // Cek jika username sudah ada
    const existingUser = await this.userService.findOneByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username sudah digunakan');
    }

    // Buat user baru (password akan di-hash oleh @BeforeInsert hook)
    const newUser = this.usersRepository.create({
      username,
      password_hash: password, // Berikan password asli, hook akan hash
    });

    try {
        await this.usersRepository.save(newUser);
        // Jangan kirim password hash kembali ke client
        const { password_hash, ...result } = newUser;
        return result as User;
    } catch (error) {
        // Tangani error lain jika perlu, misal constraint unique
        throw error;
    }
  }
}