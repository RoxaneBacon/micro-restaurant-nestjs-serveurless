import { NestFactory } from '@nestjs/core';
import { BffModule } from './bff/bff.module';

async function bootstrap() {
  const app = await NestFactory.create(BffModule);
  app.enableCors();
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
