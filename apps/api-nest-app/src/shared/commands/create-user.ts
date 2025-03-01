import { Command } from '@nestjs/cqrs'
import { User } from '@/entities/user.entity'

export type CreateUserEmissionDTO = {
  username: User['username']
  password: User['password']
  roles: User['roles'][number]['name'][]
}
export interface CreateUserReceptionDTO {
  data: unknown
}

export class CreateUserCommand extends Command<CreateUserReceptionDTO> {
  constructor(public readonly dto: CreateUserEmissionDTO) {
    super()
  }
}
