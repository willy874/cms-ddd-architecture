import { Query } from '@nestjs/cqrs'

export type FindUserEmissionDTO = {
  username: string
  password: string
}

export interface FindUserReceptionDTO {
  data: unknown
}

export class FindUserQuery extends Query<FindUserReceptionDTO> {
  constructor(public readonly dto: FindUserEmissionDTO) {
    super()
  }
}
