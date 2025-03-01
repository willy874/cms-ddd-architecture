import { ConfigType } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import queueConfigProvider from '@/shared/config/queue'
import { Module } from '@nestjs/common'

export const MESSAGE_SERVICE = 'MESSAGE_SERVICE'

const messageQueueProvider = {
  provide: MESSAGE_SERVICE,
  inject: [queueConfigProvider.KEY],
  useFactory: async (config: ConfigType<typeof queueConfigProvider>) => {
    const client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${config.user}:${config.password}@${config.host}:${config.port}`],
        queue: 'user_queue',
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
