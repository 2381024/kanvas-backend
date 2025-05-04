import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../user/entities/user.entity'; // Import User jika perlu mengembalikan user

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username' }); // Field yg digunakan untuk login
  }

  async validate(username: string, pass: string): Promise<any> {
    const user = await this.authService.validateUser(username, pass);
    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }
    // Yang di-return di sini akan tersedia di request.user pada route yg diproteksi LocalAuthGuard
    const { password_hash, ...result } = user; // Jangan kirim password hash
    return result;
  }
}