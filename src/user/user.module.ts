// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Impor User entity
  providers: [UserService],
  exports: [UserService], // Ekspor service agar bisa dipakai di AuthModule
})
export class UserModule {}