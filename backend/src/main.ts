import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express'; // Importar esto

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // AUMENTAR LÍMITE DE PAYLOAD AQUÍ
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`App running on port ${port}`);
}
bootstrap();