import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(process.env.API_PREFIX || '')
  await app.listen(env.PORT ?? 3000)
}
bootstrap()
