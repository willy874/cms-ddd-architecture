import { z } from 'zod'
import { to } from 'await-to-js'
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus, QueryHandlerNotFoundException, CommandHandlerNotFoundException } from '@nestjs/cqrs'
import { FindUserQuery } from '@/shared/queries'
import { CreateUserCommand } from '@/shared/commands'
import { LoginDto } from './login.dto'

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
    const [error, result] = await to(this.queryBus.execute(query))
    if (error instanceof QueryHandlerNotFoundException) {
      return null
    }
    if (error) {
      throw error
    }
    return UserSchema.or(z.null()).parse(result.data)
  }

  async getUserById(id: number) {
    const query = new FindUserQuery({
      id,
    })
    const [error, result] = await to(this.queryBus.execute(query))
    if (error instanceof QueryHandlerNotFoundException) {
      return null
    }
    if (error) {
      throw error
    }
    return result.data
  }

  async getUserByName(username: string) {
    const query = new FindUserQuery({
      username,
    })
    const [error, result] = await to(this.queryBus.execute(query))
    if (error instanceof QueryHandlerNotFoundException) {
      return null
    }
    if (error) {
      throw error
    }
    return result.data
  }

  async insertUser(dto: { username: string, password: string }) {
    const command = new CreateUserCommand({
      username: dto.username,
      password: dto.password,
      roles: [],
    })
    const [error, result] = await to(this.commandBus.execute(command))
    if (error instanceof CommandHandlerNotFoundException) {
      return null
    }
    if (error) {
      throw error
    }
    return result.data
  }
}
