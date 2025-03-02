import { pipe } from 'rxjs'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
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
    .useGlobalPipes(new ValidationPipe())
  await createMicroservices(app)
  await app.listen(process.env.APP_PORT ?? 3000)
}
bootstrap()
