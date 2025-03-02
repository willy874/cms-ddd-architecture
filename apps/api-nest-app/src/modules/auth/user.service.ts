import { z } from 'zod'
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus, QueryHandlerNotFoundException, CommandHandlerNotFoundException } from '@nestjs/cqrs'
import { FindUserQuery } from '@/shared/queries'
import { CreateUserCommand } from '@/shared/commands'
import { LoginDto } from './login.dto'
import { RegisterDto } from './register.dto'

const executeCondition = <T, R>(execute: () => Promise<T>, cb: (res: T) => R): Promise<Awaited<R>> => {
  return execute()
    .then(cb)
    .catch((error) => {
      if (error instanceof QueryHandlerNotFoundException) {
        return null
      }
      if (error instanceof CommandHandlerNotFoundException) {
        return null
      }
      if (error) {
        throw error
      }
    })
}

export const UserSchema = z.object({
  id: z.number(),
})

@Injectable()
export class AuthUserService {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  async getUserByNameAndPassword(dto: LoginDto) {
    const query = new FindUserQuery({
      username: dto.username,
      password: dto.password,
    })
    return executeCondition(() => this.queryBus.execute(query), result => UserSchema.or(z.null()).parse(result.data))
  }

  async getUserById(id: number) {
    const query = new FindUserQuery({
      id,
    })
    return executeCondition(() => this.queryBus.execute(query), result => result.data)
  }

  async getUserByName(username: string) {
    const query = new FindUserQuery({
      username,
    })
    return executeCondition(() => this.queryBus.execute(query), result => result.data)
  }

  async insertUser(dto: RegisterDto) {
    const command = new CreateUserCommand({
      username: dto.username,
      password: dto.password,
      roles: [],
    })
    return executeCondition(() => this.commandBus.execute(command), result => result.data)
  }
}
