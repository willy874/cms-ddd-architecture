import { RmqContext } from '@nestjs/microservices'
import { Channel, ConsumeMessage } from 'amqplib'

export class ConsumerContext extends RmqContext {
  getChannelRef() {
    return super.getChannelRef() as Channel
  }

  getMessage() {
    return super.getMessage() as ConsumeMessage
  }
}
