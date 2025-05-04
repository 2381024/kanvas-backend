import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module'; // Impor UserModule
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm'; // Impor TypeOrmModule
import { User } from '../user/entities/user.entity'; // Impor User entity

@Module({
  imports: [
    UserModule, // Sediakan UserService
    PassportModule,
    ConfigModule, // Untuk akses .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION_TIME') },
      }),
    }),
    TypeOrmModule.forFeature([User]), // Impor User entity di sini juga agar bisa inject repository di auth.service
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy], // Daftarkan strategy
  exports: [AuthService], // Ekspor AuthService jika diperlukan di modul lain
})
export class AuthModule {}