import { Inject, Injectable } from '@nestjs/common'
import { CacheService } from '@/shared/cache'
import { QueryPageResult, QueryParams } from '@/shared/types'
import { UpdateUserDto, CreateUserDto } from '@/repositories/dtos'
import { USER_REPOSITORY } from '@/repositories/providers'
import { IUserRepository } from '@/repositories/interfaces'
import { TokenService } from './token.service'
import { jsonKeySort } from './utils'

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    private cacheService: CacheService,
    private tokenService: TokenService,
  ) {}

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
    if (!key) return null

    const data = await this.cacheService.get(key)
    if (!data) return null

    return JSON.parse(data) as QueryPageResult
  }

  async pageQuery(params: QueryParams): Promise<QueryPageResult> {
    const [data, total] = await this.userRepository.searchQuery(params)
    return {
      list: data,
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      total,
    }
  }

  insertUser(payload: CreateUserDto) {
    return this.userRepository.insertUser(payload)
  }

  updateUser(id: number, payload: UpdateUserDto) {
    return this.userRepository.updateUser(id, payload)
  }

  deleteUser(id: number) {
    return this.userRepository.deleteUser(id)
  }

  getUserById(id: number) {
    return this.userRepository.getUserById(id)
  }

  getUserByNameAndPassword(dto: { username: string, password: string }) {
    return this.userRepository.getUserByNameAndPassword(dto)
  }

  getUserByName(username: string) {
    return this.userRepository.getUserByName(username)
  }
}
