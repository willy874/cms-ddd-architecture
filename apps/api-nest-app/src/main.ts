import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipePlugin } from './utils/validation'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  })
  app.enableShutdownHooks()
  app.setGlobalPrefix(process.env.API_PREFIX || '')
  app.useGlobalPipes(new ValidationPipePlugin())
  await app.listen(process.env.APP_PORT ?? 3000)
}
bootstrap()
