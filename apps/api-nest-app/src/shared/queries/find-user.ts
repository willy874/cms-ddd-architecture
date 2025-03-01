import { Query } from '@nestjs/cqrs'

type LoginSearcher = {
  type: 'login'
  username: string
  password: string
}

type UserIdSearcher = {
  type: 'userid'
  id: number
}

export type FindUserEmissionDTO = LoginSearcher | UserIdSearcher

export interface FindUserReceptionDTO {
  data: unknown
}

export class FindUserQuery extends Query<FindUserReceptionDTO> {
  constructor(public readonly dto: FindUserEmissionDTO) {
    super()
  }
}
