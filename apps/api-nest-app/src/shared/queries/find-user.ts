import { User } from '@/entities/user.entity'
import { Query } from '@nestjs/cqrs'

export type FindUserEmissionDTO = {
  id?: User['id']
  username?: User['username']
  password?: User['password']
}

export interface FindUserReceptionDTO {
  data: unknown
}

export class FindUserQuery extends Query<FindUserReceptionDTO> {
  constructor(public readonly dto: FindUserEmissionDTO) {
    super()
  }
}
