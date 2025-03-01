import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateUserCommand } from '@/shared/commands'
import { UserService } from './user.service'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private userService: UserService) {}

  async execute(command: CreateUserCommand) {
    const { username, password, roles } = command.dto
    const user = await this.userService.insertUser({
      username, password, roles,
    })
    return {
      data: user,
    }
  }
}
