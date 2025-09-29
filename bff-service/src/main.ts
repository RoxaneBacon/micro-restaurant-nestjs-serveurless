import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SwaggerUIConfig } from './shared/config/interfaces/swaggerui-config.interface';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Retrieve config service
  const configService = app.get(ConfigService);

  // Add validation pipi for all endpoints
  app.useGlobalPipes(new ValidationPipe());

  // Swagger UI Definition
  const swaggeruiConfig = configService.get<SwaggerUIConfig>('swaggerui');
  const config = new DocumentBuilder()
    .setTitle(swaggeruiConfig?.title || 'API Documentation')
    .setDescription(swaggeruiConfig?.description || 'The API description')
    .setVersion(configService.get('npm_package_version') || '1.0')
    .addServer('/', 'Without gateway')
    .addServer('/dining', 'Through gateway')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggeruiConfig?.path || 'doc/bff', app, document);

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  // Run the app
  const appPort = configService?.get('app.port') || 9400;
  await app.listen(appPort);
}
bootstrap();
