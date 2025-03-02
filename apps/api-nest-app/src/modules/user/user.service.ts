import { Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY, UserRepository } from './user.repository'
import { QueryParams } from '@/types'
import { TokenService } from '@/shared/token'
import { CacheService, CACHE_PROVIDER } from '@/shared/cache'
import { CreateUserDto } from './create-user.dto'
import { UpdateUserDto } from './update-user.dto'
import { RoleRepository, USER_ROLE_REPOSITORY } from './roles'
import { In } from 'typeorm'

type QueryPageResult<T = any> = {
  list: T[]
  page: number
  total: number
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
    const { username, password } = dto
    return this.userRepository.findOne({ where: { username, password } })
  }

  getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } })
  }

  getUserByName(username: string) {
    return this.userRepository.findOne({ where: { username } })
  }

  queryPage(params: QueryParams): Promise<QueryPageResult> {
    return this.userRepository.queryPage(params)
  }

  async createCache<T extends QueryParams>(params: T, queryFn: (p: T) => Promise<unknown>) {
    const payload = { resource: 'users' }
    const key = `query:${JSON.stringify(params)}`
    const data = await this.cacheService.get(key)
    if (!data) {
      const resultData = await queryFn(params)
      this.cacheService.set(key, JSON.stringify(resultData))
    }
    const token = await this.tokenService.createQueryToken(payload)
    this.cacheService.set(token, key)
    return token
  }

  async queryByToken(token: string) {
    const key = await this.cacheService.get(token)
    const data = await this.cacheService.get(key)
    return JSON.parse(data) as QueryPageResult
  }

  async insertUser(payload: CreateUserDto) {
    const { roles: roleNames, ...rest } = payload
    const roles = await this.roleRepository.findBy({ name: In(roleNames) })
    return this.userRepository.save({ ...rest, roles })
  }

  updateUser(id: number, payload: UpdateUserDto) {
    return this.userRepository.update(id, { ...payload })
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id)
  }
}
