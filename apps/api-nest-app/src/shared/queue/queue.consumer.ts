import { Controller } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

@Controller()
export class MessageQueueConsumer {
  @MessagePattern('message_event')
  async handleMessage(@Payload() data: unknown, @Ctx() context: RmqContext) {
    console.log('Received Message from RabbitMQ:', data, context)
    return { status: 'Message Processed', data, context }
  }
}
