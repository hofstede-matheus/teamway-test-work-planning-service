import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

const API_PORT = process.env.API_PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(API_PORT, () => {
    console.log(`API running on port ${API_PORT} ✨`);
  });
}
bootstrap();
