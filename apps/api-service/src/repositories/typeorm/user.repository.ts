import { Inject, Injectable } from '@nestjs/common'
import { In, Repository } from 'typeorm'
import { QueryPageResult, QueryParams } from '@/shared/types'
import { DATABASE_PROVIDER, DatabaseRepository, createSearchQuery } from '@/shared/database/typeorm'
import { User } from '@/models/typeorm/user.entity'
import { Role } from '@/models/typeorm/role.entity'
import { UpdateUserDto, CreateUserDto } from '../dtos'
import { IUserRepository, UserDatabaseQueryDTO } from '../interfaces/user.repository'

@Injectable()
export class UserRepository implements IUserRepository {
  private userRepository: Repository<User>
  private roleRepository: Repository<Role>
  constructor(
    @Inject(DATABASE_PROVIDER) private db: DatabaseRepository,
  ) {
    this.userRepository = this.db.getRepository(User)
    this.roleRepository = this.db.getRepository(Role)
  }

  private async getRolesByName(names?: string[]) {
    if (!names) {
      return []
    }
    if (names.length === 0) {
      return []
    }
    const roles = await this.roleRepository.findBy({ name: In(names) })
    return roles
  }

  getUserByNameAndPassword(dto: { username: string, password: string }) {
    return this.userRepository.findOne({ where: dto })
  }

  getUserByName(username: string) {
    return this.userRepository.findOne({ where: { username } })
  }

  getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } })
  }

  async insertUser(payload: CreateUserDto) {
    const { roles: roleNames, ...rest } = payload
    const roles = await this.getRolesByName(roleNames)
    return await this.userRepository.save({ ...rest, roles })
  }

  async updateUser(id: number, payload: UpdateUserDto) {
    const { roles: roleNames, ...rest } = payload
    const roles = await this.getRolesByName(roleNames)
    return await this.userRepository.update(id, { ...rest, roles })
  }

  async deleteUser(id: number) {
    return await this.userRepository.delete(id)
  }

  async pageQuery(params: QueryParams): Promise<QueryPageResult> {
    const [list, total] = await createSearchQuery(this.userRepository, {
      ...params,
      filter: ['id', 'username'],
    })
    return {
      list,
      total,
      page: 1,
      pageSize: 10,
    }
  }

  async searchQuery(params: QueryParams): Promise<[UserDatabaseQueryDTO[], number]> {
    const [data, total] = await createSearchQuery(this.userRepository, {
      ...params,
      filter: ['id', 'username'],
    })
    return [data, total] as const
  }
}
