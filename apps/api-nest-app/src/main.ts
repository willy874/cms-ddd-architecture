import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipePlugin } from './utils/validation'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  })
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'], // RabbitMQ 連線資訊
      queueOptions: {
        durable: false,
      },
    },
  })
  app.setGlobalPrefix(process.env.API_PREFIX || '')
  app.useGlobalPipes(new ValidationPipePlugin())
  await app.listen(process.env.APP_PORT ?? 3000)
}
bootstrap()
