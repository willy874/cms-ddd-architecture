import { QueryPageResult, QueryParams } from '@/shared/types'
import { User } from '@/models'
import { CreateUserDto } from '../dtos/create-user.dto'
import { UpdateUserDto } from '../dtos/update-user.dto'

export interface UserDatabaseQueryDTO {
  id: User['id']
  username: User['username']
}

export abstract class IUserRepository {
  abstract getUserByNameAndPassword(dto: { username: string, password: string }): Promise<User | null>
  abstract getUserByName(username: string): Promise<User | null>
  abstract getUserById(id: number): Promise<User | null>
  abstract insertUser(payload: CreateUserDto): Promise<unknown>
  abstract updateUser(id: number, payload: UpdateUserDto): Promise<unknown>
  abstract deleteUser(id: number): Promise<unknown>
  abstract pageQuery(params: QueryParams): Promise<QueryPageResult>
  abstract searchQuery(params: QueryParams): Promise<[UserDatabaseQueryDTO[], number]>
}
