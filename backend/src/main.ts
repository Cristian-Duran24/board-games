import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express'; // Importar los middlewares de Express para aumentar el límite de payload

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Aumentar el límite de payload para manejar archivos grandes o datos extensos
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // En desarrollo, el proxy de Angular (proxy.conf.json) intercepta /graphql
  // antes de que el browser envíe el header Origin, por lo que CORS no se activa.
  // enableCors queda configurado para cuando se implemente el entorno de producción.
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`App running on port ${port}`);
}
bootstrap();