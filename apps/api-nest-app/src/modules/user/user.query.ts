import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindUserQuery, FindUserReceptionDTO } from '@/shared/queries'
import { UserService } from './user.service'

@QueryHandler(FindUserQuery)
export class FindUserHandler implements IQueryHandler<FindUserQuery> {
  constructor(private userService: UserService) {}

  async execute(query: FindUserQuery): Promise<FindUserReceptionDTO> {
    const { id, username, password } = query.dto
    if (id) {
      return {
        data: await this.userService.getUserById(id),
      }
    }
    if (username && password) {
      return {
        data: await this.userService.getUserByNameAndPassword({
          username, password,
        }),
      }
    }
    if (username) {
      return {
        data: await this.userService.getUserByName(username),
      }
    }
    return {
      data: null,
    }
  }
}
