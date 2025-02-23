import { Inject, Injectable } from '@nestjs/common'
import { USER_REPOSITORY, UserRepositoryProvider } from './user.repository'
import { GetProviderType, QueryParams } from '@/utils/types'
import { Like } from 'typeorm'
import { TokenService } from '@/shared/token'
import { CacheService } from '@/shared/cache'
import { CreateUserDto } from './create-user.dto'
import { UpdateUserDto } from './update-user.dto'

export type UserRepository = GetProviderType<typeof UserRepositoryProvider>

type QueryPageResult<T = any> = {
  list: T[]
  page: number
  total: number
}

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private cacheService: CacheService,
    private userRepository: UserRepository,
    private tokenService: TokenService,
  ) {}

  getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } })
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
    const data = await this.cacheService.get(key)
    if (!data) {
      const resultData = await this.queryPage(query)
      this.cacheService.set(key, JSON.stringify(resultData))
    }
    const payload = { resource: 'users' }
    const token = await this.tokenService.createQueryToken(payload)
    this.cacheService.set(token, key)
    return token
  }

  async queryByToken(token: string) {
    const key = await this.cacheService.get(token)
    const data = await this.cacheService.get(key)
    return JSON.parse(data) as QueryPageResult
  }

  createUser(payload: CreateUserDto) {
    return this.userRepository.save({ ...payload })
  }

  updateUser(id: number, payload: UpdateUserDto) {
    return this.userRepository.update(id, { ...payload })
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id)
  }
}
