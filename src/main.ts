import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ContextHolder } from '@frontegg/client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  ContextHolder.setContext({
    FRONTEGG_CLIENT_ID: '<YOUR_CLIENT_ID>',
    FRONTEGG_API_KEY: '<YOUR_API_KEY>',
  });

  await app.listen(8080);
}
bootstrap();
