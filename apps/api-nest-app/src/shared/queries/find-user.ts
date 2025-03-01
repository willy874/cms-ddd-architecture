import { Query } from '@nestjs/cqrs'

type LoginSearcher = {
  type: 'login'
  username: string
  password: string
}

type UserIdSearcher = {
  type: 'user-id'
  id: number
}

type UserNameSearcher = {
  type: 'user-name'
  username: string
}

export type FindUserEmissionDTO = LoginSearcher | UserIdSearcher | UserNameSearcher

export interface FindUserReceptionDTO {
  data: unknown
}

export class FindUserQuery extends Query<FindUserReceptionDTO> {
  constructor(public readonly dto: FindUserEmissionDTO) {
    super()
  }
}
