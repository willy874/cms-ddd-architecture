import { NestFactory } from '@nestjs/core'
import { AuthModule } from './modules/auth'

async function bootstrap() {
  const app = await NestFactory.create({
    module: class AuthAppModule {},
    imports: [
      AuthModule.register(),
    ],
  })
  await app.listen(process.env.PORT ?? 5001)
}

bootstrap()
