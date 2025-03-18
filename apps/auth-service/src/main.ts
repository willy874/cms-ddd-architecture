import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnvironment, loadEnv } from '@packages/shared';

async function bootstrap() {
  loadEnv()
  const env = getEnvironment();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? env.AUTH_API_PORT);
}
bootstrap();
