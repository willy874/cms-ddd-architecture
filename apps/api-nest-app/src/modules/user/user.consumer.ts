import { Controller } from '@nestjs/common'
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices'
import { ConsumerContext } from '@/shared/queue'

export const MSG_EVENT = 'message_event'

type MsgEventPayload = { data: string }
type MsgEventResult = { message: string }

@Controller()
export class UserConsumer {
  @MessagePattern(MSG_EVENT)
  async handleMessage(@Payload() payload: MsgEventPayload, @Ctx() context: ConsumerContext): Promise<MsgEventResult> {
    const channel = context.getChannelRef()
    const message = context.getMessage()
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      channel.ack(message)
      return { message: 'Message received!', ...payload }
    }
    catch (error) {
      console.error('Order processing failed:', error)
      channel.nack(message, false, false)
    }
  }
}

export type ConsumerMap = {
  [MSG_EVENT]: [MsgEventResult, MsgEventPayload]
}
