import { INestApplication, INestMicroservice } from '@nestjs/common'
import { RmqOptions, Transport } from '@nestjs/microservices'
import { COMMAND_QUEUE, EVENT_BUS_QUEUE } from './constants'

export const initMessageQueueService = (callback?: (app: INestMicroservice) => void) => {
  return (app: INestApplication) => {
    const config = {
      user: process.env.QUEUE_USER,
      password: process.env.QUEUE_PASSWORD,
      host: process.env.QUEUE_HOST,
      port: process.env.QUEUE_PORT,
    }
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
    const config = {
      user: process.env.QUEUE_USER,
      password: process.env.QUEUE_PASSWORD,
      host: process.env.QUEUE_HOST,
      port: process.env.QUEUE_PORT,
    }
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
