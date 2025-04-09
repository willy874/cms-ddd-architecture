import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { Module } from '@nestjs/common'
import { COMMAND_QUEUE, EVENT_BUS_QUEUE, EVENT_BUS_SERVICE, MESSAGE_SERVICE } from './constants'

const messageQueueProvider = {
  provide: MESSAGE_SERVICE,
  useFactory: async () => {
    const config = {
      user: process.env.QUEUE_USER,
      password: process.env.QUEUE_PASSWORD,
      host: process.env.QUEUE_HOST,
      port: process.env.QUEUE_PORT,
    }
    const client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${config.user}:${config.password}@${config.host}:${config.port}`],
        queue: COMMAND_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    })
    await client.connect()
    return client
  },
}

@Module({
  providers: [messageQueueProvider],
  exports: [messageQueueProvider],
})
export class MessageQueueModule {}

const eventBusProvider = {
  provide: EVENT_BUS_SERVICE,
  useFactory: async () => {
    const config = {
      user: process.env.QUEUE_USER,
      password: process.env.QUEUE_PASSWORD,
      host: process.env.QUEUE_HOST,
      port: process.env.QUEUE_PORT,
    }
    const client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${config.user}:${config.password}@${config.host}:${config.port}`],
        queue: EVENT_BUS_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    })
    await client.connect()
    return client
  },
}

@Module({
  providers: [eventBusProvider],
  exports: [eventBusProvider],
})
export class EventBusModule {}
