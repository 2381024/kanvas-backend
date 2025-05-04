// src/auth/auth.controller.ts
import { Controller, Request, Post, UseGuards, Body, HttpCode, HttpStatus, Get } from '@nestjs/common'; // Tambahkan Get
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Import JwtAuthGuard
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '../user/entities/user.entity'; // Import User jika perlu type hint

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    // req.user dari LocalStrategy tidak berisi password_hash
    const user = await this.authService.register(registerUserDto);
    // Pastikan tidak mengirim password hash kembali
    const { password_hash, ...result } = user;
    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() loginUserDto: LoginUserDto) {
      return this.authService.login(req.user);
  }

  // --- TAMBAHKAN ENDPOINT INI ---
  @UseGuards(JwtAuthGuard) // Proteksi dengan JWT Guard
  @Get('profile')
  getProfile(@Request() req): Omit<User, 'password_hash'> { // Kembalikan User tanpa password_hash
      // req.user sudah diisi oleh JwtStrategy.validate() dengan User entity
      // Pastikan password_hash tidak ikut terkirim
      const { password_hash, ...userProfile } = req.user;
      return userProfile;
  }
  // -----------------------------
}