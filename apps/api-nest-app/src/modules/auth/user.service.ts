import { z } from 'zod'
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { FindUserQuery } from '@/shared/queries'
import { LoginDto } from './login.dto'
import { CreateUserCommand } from '@/shared/commands/create-user'

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
      type: 'login',
      username: dto.username,
      password: dto.password,
    })
    const result = await this.queryBus.execute(query)
    return UserSchema.parse(result.data)
  }

  async getUserById(id: number) {
    const query = new FindUserQuery({
      type: 'user-id',
      id,
    })
    const result = await this.queryBus.execute(query)
    return result.data
  }

  async getUserByName(username: string) {
    const query = new FindUserQuery({
      type: 'user-name',
      username,
    })
    const result = await this.queryBus.execute(query)
    return result.data
  }

  async insertUser(dto: { username: string, password: string }) {
    await this.commandBus.execute(new CreateUserCommand({
      username: dto.username,
      password: dto.password,
      roles: [],
    }))
    return {}
  }
}
