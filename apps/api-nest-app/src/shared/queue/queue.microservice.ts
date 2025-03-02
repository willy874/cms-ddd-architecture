import { INestApplication, INestMicroservice } from '@nestjs/common'
import { RmqOptions, Transport } from '@nestjs/microservices'
import queueConfigProvider from '@/shared/config/queue'
import { COMMAND_QUEUE, EVENT_BUS_QUEUE } from './constants'

export const initMessageQueueService = (callback?: (app: INestMicroservice) => void) => {
  return (app: INestApplication) => {
    const config = app.get(queueConfigProvider.KEY)
    const server = app.connectMicroservice<RmqOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${config.user}:${config.password}@${config.host}:${config.port}`],
        queue: COMMAND_QUEUE,
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
}

export const initEventBusService = (callback?: (app: INestMicroservice) => void) => {
  return (app: INestApplication) => {
    const config = app.get(queueConfigProvider.KEY)
    const server = app.connectMicroservice<RmqOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${config.user}:${config.password}@${config.host}:${config.port}`],
        queue: EVENT_BUS_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    })
    callback?.(server)
    return app
  }
}
