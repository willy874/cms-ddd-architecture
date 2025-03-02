import { Controller } from '@nestjs/common'
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices'
import { ConsumerContext } from '@/shared/queue'
import { User } from '@/entities/user.entity'
import { CreateUserDto } from './create-user.dto'
import { UserService } from './user.service'

export const CREATE_USER = 'CREATE_USER'

type CreateUserPayload = CreateUserDto
type CreateUserResult = User

@Controller()
export class UserConsumer {
  constructor(private userService: UserService) {}

  @MessagePattern(CREATE_USER)
  async handleCreateUser(@Payload() payload: CreateUserPayload, @Ctx() context: ConsumerContext): Promise<CreateUserResult> {
    const channel = context.getChannelRef()
    const message = context.getMessage()
    try {
      const data = await this.userService.insertUser(payload)
      channel.ack(message)
      return data
    }
    catch (error) {
      console.error('Order processing failed:', error)
      throw error
    }
  }
}

export type ConsumerMap = {
  [CREATE_USER]: [CreateUserResult, CreateUserPayload]
}
