import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(process.env.API_PREFIX || '')
  await app.listen(process.env.APP_PORT ?? 3000)
}
bootstrap()
