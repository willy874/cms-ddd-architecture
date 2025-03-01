import { Command } from '@nestjs/cqrs'

export interface CreateUserEmissionDTO {
  username: string
  password: string
  roles: string[]
}

export interface CreateUserReceptionDTO {
  data: unknown
}

export class CreateUserCommand extends Command<CreateUserReceptionDTO> {
  constructor(public readonly dto: CreateUserEmissionDTO) {
    super()
  }
}
