import { pipe } from 'rxjs'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipePlugin } from './utils/validation'
import { initMessageQueueService, initEventBusService } from './shared/queue'

const createMicroservices = pipe(
  initMessageQueueService(),
  initEventBusService(),
  app => app.startAllMicroservices(),
)

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  })
  app
    .setGlobalPrefix(process.env.API_PREFIX || '')
    .useGlobalPipes(new ValidationPipePlugin())
  await createMicroservices(app)
  await app.listen(process.env.APP_PORT ?? 3000)
}
bootstrap()
