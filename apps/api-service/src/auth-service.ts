import { NestFactory } from '@nestjs/core'
import { AuthModule } from './modules/auth'
import { loadEnv } from '@packages/shared'

async function bootstrap() {
  await loadEnv()
  const app = await NestFactory.create({
    module: class AuthAppModule {},
    imports: [
      AuthModule.register(),
    ],
  })
  await app.listen(process.env.AUTH_API_PORT ?? 3000)
}

bootstrap()
