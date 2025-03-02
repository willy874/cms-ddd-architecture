import { INestApplication, INestMicroservice } from '@nestjs/common'
import { RmqOptions, Transport } from '@nestjs/microservices'
import queueConfigProvider from '@/shared/config/queue'

export const initMessageQueueService = (app: INestApplication, callback?: (app: INestMicroservice) => void) => {
  const config = app.get(queueConfigProvider.KEY)
  const server = app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${config.user}:${config.password}@${config.host}:${config.port}`],
      queue: 'user_queue',
      noAck: false,
      prefetchCount: 1,
      queueOptions: {
        durable: false,
      },
    },
  })
  callback?.(server)
  return app
}
