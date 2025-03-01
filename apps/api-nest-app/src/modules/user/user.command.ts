import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateUserCommand } from '@/shared/commands/create-user'
import { UserService } from './user.service'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private userService: UserService) {}

  async execute(command: CreateUserCommand) {
    const user = await this.userService.insertUser(command.dto)
    return {
      data: user,
    }
  }
}
