// src/auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common'; // Mungkin perlu jika validasi user diaktifkan
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service'; // Mungkin perlu jika validasi user diaktifkan

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService, // Inject UserService jika perlu validasi user
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // --- Gunakan getOrThrow di sini ---
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; username: string }): Promise<any> {
    // Opsional: Validasi apakah user masih ada di database
    // const user = await this.userService.findOneById(payload.sub);
    // if (!user) {
    //   throw new UnauthorizedException('User not found');
    // }
    return { userId: payload.sub, username: payload.username };
  }
}