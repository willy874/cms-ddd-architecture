import { Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY, UserRepositoryProvider } from './user.repository'
import { GetProviderType, QueryParams } from '@/utils/types'
import { Like } from 'typeorm'
import { TokenService } from '@/shared/token'
import { CACHE_PROVIDER, CacheRepository } from '@/shared/cache'

export type UserRepository = GetProviderType<typeof UserRepositoryProvider>

type QueryPageResult<T = any> = {
  list: T[]
  page: number
  total: number
}

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
    @Inject(CACHE_PROVIDER) private cacheRepository: CacheRepository,
    private tokenService: TokenService,
  ) {}

  getUserByNameAndPassword(username: string, password: string) {
    return this.userRepository.findOne({ where: { username, password } })
  }

  getUserByName(username: string) {
    return this.userRepository.findOne({ where: { username } })
  }

  getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } })
  }

  createUser(payload: { username: string, password: string }) {
    return this.userRepository.save({ ...payload })
  }

  async queryPage({ page = 1, pageSize = 10, search = '' }: QueryParams): Promise<QueryPageResult> {
    const skip = (page - 1) * pageSize
    const where = search ? { username: Like(`%${search}%`) } : undefined
    const [list, total] = await this.userRepository.findAndCount({
      skip: skip,
      take: pageSize,
      where,
    })
    return {
      list,
      page,
      total,
    }
  }

  async createCache(query: QueryParams) {
    const key = `query:${JSON.stringify(query)}`
    const data = await this.cacheRepository.get(key)
    if (!data) {
      const resultData = await this.queryPage(query)
      this.cacheRepository.set(key, JSON.stringify(resultData))
    }
    const payload = { resource: 'users' }
    const token = await this.tokenService.createQueryToken(payload)
    this.cacheRepository.set(token, key)
    return token
  }

  async queryByToken(token: string) {
    const key = await this.cacheRepository.get(token)
    const data = await this.cacheRepository.get(key)
    return JSON.parse(data) as QueryPageResult
  }

  updateUser(id: number, payload: { username: string, password: string }) {
    return this.userRepository.update(id, { ...payload })
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id)
  }
}
