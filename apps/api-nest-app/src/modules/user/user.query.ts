import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindUserQuery, FindUserReceptionDTO } from '@/shared/queries'
import { UserService } from './user.service'

@QueryHandler(FindUserQuery)
export class FindUserHandler implements IQueryHandler<FindUserQuery> {
  constructor(private userService: UserService) {}

  async execute(query: FindUserQuery): Promise<FindUserReceptionDTO> {
    if (query.dto.type === 'login') {
      return {
        data: await this.userService.getUserByNameAndPassword(query.dto),
      }
    }
    if (query.dto.type === 'userid') {
      return {
        data: await this.userService.getUserById(query.dto.id),
      }
    }
    return {
      data: null,
    }
  }
}
