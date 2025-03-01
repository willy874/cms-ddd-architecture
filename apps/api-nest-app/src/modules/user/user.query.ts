import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindUserQuery, FindUserReceptionDTO } from '@/shared/queries'
import { UserService } from './user.service'

@QueryHandler(FindUserQuery)
export class FindUserHandler implements IQueryHandler<FindUserQuery> {
  constructor(private userService: UserService) {}

  async execute(query: FindUserQuery): Promise<FindUserReceptionDTO> {
    if (query.dto.username && query.dto.password) {
      return {
        data: await this.userService.getUserByNameAndPassword(query.dto),
      }
    }
    return {
      data: null,
    }
  }
}
