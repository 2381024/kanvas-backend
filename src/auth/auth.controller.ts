import { Controller, Request, Post, UseGuards, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto'; // Meskipun tidak dipakai langsung oleh Guard, tetap baik untuk validasi body

@Controller('auth') // Base path /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    // Tidak perlu DTO LoginUserDto di sini karena validasi dilakukan oleh LocalAuthGuard
    return this.authService.register(registerUserDto);
  }

  // Gunakan LocalAuthGuard untuk memvalidasi username & password
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK) // Set status code ke 200 OK untuk login sukses
  async login(@Request() req, @Body() loginUserDto: LoginUserDto) {
      // Body loginUserDto diperlukan agar ValidationPipe (jika global) bisa validasi input
      // req.user berisi data user dari hasil validate() di LocalStrategy
      return this.authService.login(req.user);
  }
}