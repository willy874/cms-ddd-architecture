import { Inject, Injectable } from '@nestjs/common'
import { CacheService, CACHE_PROVIDER } from '@/shared/cache'
import { QueryPageResult, QueryParams } from '@/shared/types'
import { CreateUserDto } from './create-user.dto'
import { UpdateUserDto } from './update-user.dto'
import { USER_REPOSITORY, UserRepository } from './user.repository'
import { RoleRepository, USER_ROLE_REPOSITORY } from './role.repository'
import { TokenService } from './token.service'

const jsonKeySort = (json: object) => {
  if (!json) return null
  const entries = Object.entries(json)
  return Object.fromEntries(
    entries.sort((a, b) => a[0].localeCompare(b[0]))
  )
}

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_PROVIDER) private cacheService: CacheService,
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
    @Inject(USER_ROLE_REPOSITORY) private roleRepository: RoleRepository,
    private tokenService: TokenService,
  ) {}

  getUserByNameAndPassword(dto: { username: string, password: string }) {
    return this.userRepository.findOne({ where: dto })
  }

  getUserNamesByName(username: string) {
    return this.userRepository.findOne({ where: { username } })
  }

  getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } })
  }

  async pageQuery(params: QueryParams): Promise<QueryPageResult> {
    const securitySettings = {
      filter: ['password'],
    }
    const [list, total] = await this.userRepository.searchQuery(params)
    return {
      list,
      total,
      page: 1,
      pageSize: 10,
    }
  }

  async createCache<T extends QueryParams>(params: T, queryFn: (p: T) => Promise<unknown>) {
    const payload = { resource: 'users' }
    const key = JSON.stringify(jsonKeySort(params))
    const dataQueryKey = `query:${key}`
    const data = await this.cacheService.get(dataQueryKey)
    if (!data) {
      const resultData = await queryFn(params)
      await this.cacheService.set(dataQueryKey, JSON.stringify(resultData))
    }
    const token = await this.tokenService.createQueryToken(payload)
    this.cacheService.set(token, dataQueryKey, 60 * 60)
    return token
  }

  async queryByToken(token: string) {
    const key = await this.cacheService.get(token)
    const data = await this.cacheService.get(key)
    return JSON.parse(data) as QueryPageResult
  }

  async insertUser(payload: CreateUserDto) {
    const { roles: roleNames, ...rest } = payload
    const findRoleNames = this.roleRepository.createFindOperator('in', roleNames,  true, true)
    const roles = await this.roleRepository.findBy({ name: findRoleNames })
    return this.userRepository.save({ ...rest, roles })
  }

  async updateUser(id: number, payload: UpdateUserDto) {
    const { roles: roleNames, ...rest } = payload
    const findRoleNames = this.roleRepository.createFindOperator('in', roleNames,  true, true)
    const roles = await this.roleRepository.findBy({ name: findRoleNames })
    return this.userRepository.update(id, { ...rest, roles })
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id)
  }
}
