import { NestFactory } from '@nestjs/core'
import { AuthModule } from './services/auth'
import { loadEnv } from '@packages/shared'
import { IncomingMessage } from 'http'

async function bootstrap() {
  await loadEnv()
  const app = await NestFactory.create({
    module: class AuthAppModule {},
    imports: [
      AuthModule.register(),
    ],
  })
  app.useGlobalInterceptors({
    intercept: (ctx, next) => {
      const msg = ctx.getArgs()[0] as IncomingMessage
      console.log(`request:`, msg.url, msg.method)
      return next.handle()
    },
  })
  await app.listen(process.env.AUTH_API_PORT ?? 3000)
  console.log(`Auth service is running on: http://${process.env.AUTH_API_HOST}:${process.env.AUTH_API_PORT}`)
}

bootstrap()
