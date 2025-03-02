import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateUserCommand } from '@/shared/commands'
import { MessageQueueProducer } from '@/shared/queue'
import { UserService } from './user.service'
import { ConsumerMap, CREATE_USER } from './user.consumer'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private userService: UserService,
    private producer: MessageQueueProducer<ConsumerMap>
  ) {}

  async execute(command: CreateUserCommand) {
    const { username, password, roles } = command.dto
    const newUser = { username, password, roles }
    const [result] = await this.producer.publish(CREATE_USER, newUser)
    return {
      data: result,
    }
  }
}
