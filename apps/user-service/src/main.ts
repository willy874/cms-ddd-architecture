import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEnv, getEnvironment } from './shared/config';

async function bootstrap() {
  loadEnv()
  const env = getEnvironment();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? env.USER_API_PORT);
}
bootstrap();
