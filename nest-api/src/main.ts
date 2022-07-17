import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';
// import * as csurf from 'csurf';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  app.use(cookieParser());
  app.use(helmet());

  app.use(helmet.contentSecurityPolicy());
  app.use(helmet.dnsPrefetchControl());
  app.enableCors({
    origin: config.get('BASE_URL'),
    credentials: true,
  });
  app.setGlobalPrefix('');

  const options = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('The Swagger API')
    .setVersion('1.0')
    .addTag('Customers')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(compression());
  // app.use(csurf());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(port, () => {
    console.log('[Starting Nest-API]', config.get<string>('BASE_URL'));
  });
}
bootstrap();
