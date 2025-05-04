// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Import ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktifkan CORS jika frontend dan backend beda domain/port
  app.enableCors(); // Konfigurasi lebih lanjut jika perlu: app.enableCors({ origin: 'http://localhost:3000' });

  // Gunakan ValidationPipe secara global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Hanya property di DTO yang akan diterima
    forbidNonWhitelisted: true, // Melempar error jika ada property tak dikenal
    transform: true, // Otomatis transformasi payload ke instance DTO
    transformOptions: {
        enableImplicitConversion: true, // Membantu konversi tipe implisit (misal string 'true' -> boolean true)
      },
    }));

  await app.listen(process.env.PORT || 3001); // Gunakan port dari env atau default 3001
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();