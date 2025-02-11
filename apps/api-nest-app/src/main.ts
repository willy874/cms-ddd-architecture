import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(process.env.API_PREFIX || '')
  await app.listen(env.PORT ?? 3000)
  const url = await app.getUrl()
  console.log(`Application is running on: ${url.replace(/\[::1\]/, 'localhost')}/hello`)
}
bootstrap()
