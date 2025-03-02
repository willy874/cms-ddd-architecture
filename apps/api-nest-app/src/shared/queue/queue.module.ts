import { ConfigType } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import queueConfigProvider from '@/shared/config/queue'
import { Module } from '@nestjs/common'
import { COMMAND_QUEUE, EVENT_BUS_QUEUE, EVENT_BUS_SERVICE, MESSAGE_SERVICE } from './constants'

const messageQueueProvider = {
  provide: MESSAGE_SERVICE,
  inject: [queueConfigProvider.KEY],
  useFactory: async (config: ConfigType<typeof queueConfigProvider>) => {
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
  inject: [queueConfigProvider.KEY],
  useFactory: async (config: ConfigType<typeof queueConfigProvider>) => {
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
