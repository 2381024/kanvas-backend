// src/auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common'; // Pastikan UnauthorizedException diimpor
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service'; // Pastikan UserService diimpor
import { User } from '../../user/entities/user.entity'; // Pastikan User entity diimpor

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService, // Pastikan UserService sudah di-inject
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // --- UBAH BAGIAN INI ---
  async validate(payload: { sub: string; username: string }): Promise<User> { // Ubah Promise<any> menjadi Promise<User>
    // 'payload.sub' berisi ID user dari token JWT
    const user = await this.userService.findOneById(payload.sub);
    if (!user) {
      // Jika user dengan ID dari token tidak ditemukan di DB
      throw new UnauthorizedException('User not found or invalid token');
    }
    // Kembalikan objek User entity lengkap
    // Pastikan findOneById tidak mengembalikan password hash jika tidak perlu
    return user; // Objek 'user' ini memiliki properti 'id'
  }
  // -----------------------
}