import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  DOCS_OPTIONS,
  DOCS_PATH,
  DOCUMENT_DESCRIPTION,
  DOCUMENT_TITLE,
} from './presentation/http/docs/swagger';

const API_PORT = process.env.API_PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerModule.setup(
    DOCS_PATH,
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(DOCUMENT_TITLE)
        .setDescription(DOCUMENT_DESCRIPTION)
        .build(),
    ),
    DOCS_OPTIONS,
  );

  await app.listen(API_PORT, () => {
    console.log(`API running on port ${API_PORT} ✨`);
  });
}
bootstrap();
